// 倒计时管理Hook，支持基于剩余时间或目标日期的倒计时
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

import { isNumber } from "../lib/utils";

import useLatest from "./useLatest";

export type TDate = dayjs.ConfigType;

export interface Options {
  interval?: number;
  leftTime?: number;
  onEnd?: () => void;
  targetDate?: TDate;
}

export interface FormattedRes {
  days: number;
  hours: number;
  milliseconds: number;
  minutes: number;
  seconds: number;
}

const calcLeft = (target?: TDate) => {
  if (!target) {
    return 0;
  }
  const left = dayjs(target).valueOf() - Date.now();
  return left < 0 ? 0 : left;
};

const parseMs = (milliseconds: number): FormattedRes => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    milliseconds: Math.floor(milliseconds) % 1000,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
  };
};

/**
 *
 * @param options.leftTime 剩余时间（毫秒）
 * @param options.targetDate 目标时间 TDate
 * @returns countdown 倒计时时间戳（毫秒）
 * @returns formattedRes 格式化后的倒计时
 */
const useCountdown = (options: Options = {}) => {
  const timer = useRef<NodeJS.Timeout>(undefined);
  const { interval = 1000, leftTime, onEnd, targetDate } = options || {};

  const memoLeftTime = useMemo<TDate>(() => {
    return isNumber(leftTime) && leftTime > 0
      ? Date.now() + leftTime
      : undefined;
  }, [leftTime]);

  const target =
    "leftTime" in options ? memoLeftTime : dayjs(targetDate).valueOf();

  const [timeLeft, setTimeLeft] = useState(() => calcLeft(target));

  const onEndRef = useLatest(onEnd);

  useEffect(() => {
    if (!target) {
      // for stop
      setTimeLeft(0);
      return;
    }
    if (timer.current) {
      clearInterval(timer.current);
    }

    // 立即执行一次
    setTimeLeft(calcLeft(target));

    timer.current = setInterval(() => {
      const targetLeft = calcLeft(target);
      setTimeLeft(targetLeft);
      if (targetLeft === 0) {
        clearInterval(timer.current);
        onEndRef?.();
      }
    }, interval);

    return () => clearInterval(timer.current);
  }, [target, interval]);

  const formattedRes = useMemo(() => parseMs(timeLeft), [timeLeft]);

  return [timeLeft, formattedRes] as const;
};

export default useCountdown;
