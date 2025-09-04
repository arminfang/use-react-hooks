// 增强版的 useEffect ，用于处理需要监听DOM元素动态变化或依赖特定目标元素的场景
import { DependencyList, EffectCallback, useEffect, useRef } from "react";

import { BasicTarget, getTargetElement } from "../lib/domTarget";
import { depsAreSame } from "../lib/utils";

const useEffectWithTarget = (
  effect: EffectCallback,
  deps: DependencyList,
  target: BasicTarget<any> | BasicTarget<any>[]
) => {
  const hasInitRef = useRef(false);

  const lastElementRef = useRef<(Element | null)[]>([]);
  const lastDepsRef = useRef<DependencyList>([]);

  const unLoadRef = useRef<any>(undefined);

  useEffect(() => {
    const targets = Array.isArray(target) ? target : [target];
    const els = targets.map((item) => getTargetElement(item));

    // init run
    if (!hasInitRef.current) {
      hasInitRef.current = true;
      lastElementRef.current = els;
      lastDepsRef.current = deps;

      unLoadRef.current = effect();
      return;
    }

    if (
      els.length !== lastElementRef.current.length ||
      !depsAreSame(lastElementRef.current, els) ||
      !depsAreSame(lastDepsRef.current, deps)
    ) {
      unLoadRef.current?.();

      lastElementRef.current = els;
      lastDepsRef.current = deps;
      unLoadRef.current = effect();
    }

    return () => {
      unLoadRef.current?.();
      hasInitRef.current = false;
    };
  });
};

export default useEffectWithTarget;
