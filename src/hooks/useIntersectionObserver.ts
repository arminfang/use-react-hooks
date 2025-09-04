// 监听DOM元素与视口或指定根元素的交叉状态，基于Intersection Observer API
// 1. 监听DOM元素是否进入/离开视口或指定根元素的可视区域
// 2. 当被观察元素与视口交叉程度达到指定阈值时，执行回调函数
// 3. 支持自定义观察选项（根元素、边距、阈值等）

import { BasicTarget, getTargetElement } from "../lib/domTarget";

import useEffectWithTarget from "./useEffectWithTarget";

import "intersection-observer";

type CallbackType = (entry: IntersectionObserverEntry) => void;

// https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver#options
export interface Options {
  callback: CallbackType;
  noneCallback?: () => void;
  root?: BasicTarget<Element>;
  rootMargin?: string;
  threshold?: number | number[];
}

const useIntersectionObserver = (target: BasicTarget, options?: Options) => {
  const { callback, noneCallback, ...option } = options || {};

  useEffectWithTarget(
    () => {
      const ele = getTargetElement(target);
      if (!ele) {
        noneCallback?.();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            callback?.(entry);
          }
        },
        {
          ...option,
          root: getTargetElement(options?.root),
        }
      );

      observer.observe(ele);

      return () => {
        observer.disconnect();
      };
    },
    [options?.rootMargin, options?.threshold, callback, noneCallback],
    target
  );
};

export default useIntersectionObserver;
