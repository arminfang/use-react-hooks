import type { BasicTarget } from "../lib/domTarget";

import useBoolean from "./useBoolean";
import useEventListener from "./useEventListener";

export interface Options {
  onChange?: (isHovering: boolean) => void;
  onEnter?: () => void;
  onLeave?: () => void;
}

const useHover = (target: BasicTarget, options?: Options): boolean => {
  const { onChange, onEnter, onLeave } = options || {};

  const [isHovering, { setFalse, setTrue }] = useBoolean(false);

  useEventListener(
    "mouseenter",
    () => {
      onEnter?.();
      setTrue();
      onChange?.(true);
    },
    {
      target,
    }
  );

  useEventListener(
    "mouseleave",
    () => {
      onLeave?.();
      setFalse();
      onChange?.(false);
    },
    {
      target,
    }
  );

  return isHovering;
};

export default useHover;
