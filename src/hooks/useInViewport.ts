import { useMemo, useState } from "react";

import { BasicTarget } from "../lib/domTarget";

import useIntersectionObserver, {
  Options as ObserverOptions,
} from "./useIntersectionObserver";

type Options = Pick<ObserverOptions, "rootMargin" | "threshold">;

const useInViewport = (target: BasicTarget, options?: Options): boolean => {
  const [isInViewport, setIsInViewport] = useState<boolean>(false);

  const memoizedOptions: ObserverOptions = useMemo(() => {
    const callback = (entry: IntersectionObserverEntry) => {
      setIsInViewport(entry.isIntersecting);
    };
    const noneCallback = () => {
      setIsInViewport(false);
    };
    return {
      callback,
      noneCallback,
      rootMargin: options?.rootMargin,
      threshold: options?.threshold,
    };
  }, [options?.rootMargin, options?.threshold]);

  useIntersectionObserver(target, memoizedOptions);

  return isInViewport;
};

export default useInViewport;
