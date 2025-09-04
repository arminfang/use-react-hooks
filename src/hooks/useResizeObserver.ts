// 监听DOM元素尺寸变化的Hook，基于ResizeObserver API
import ResizeObserver from "resize-observer-polyfill";

import { BasicTarget, getTargetElement } from "../lib/domTarget";

import useEffectWithTarget from "./useEffectWithTarget";
import useLatest from "./useLatest";

const useResizeObserver = (
  callback: ResizeObserverCallback,
  target: BasicTarget | BasicTarget[]
): void => {
  const callbackRef = useLatest(callback);

  useEffectWithTarget(
    () => {
      const targets = Array.isArray(target) ? target : [target];
      const els = targets
        .map((element) => getTargetElement(element))
        .filter(Boolean);

      if (!els.length) return;

      const observer = new ResizeObserver(callbackRef);

      els.forEach((el) => observer.observe(el!));

      return () => {
        observer.disconnect();
      };
    },
    [],
    target
  );
};

export default useResizeObserver;
