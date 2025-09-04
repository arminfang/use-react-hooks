// 获取DOM元素尺寸的Hook，实时监测元素宽高变化
import { BasicTarget, getTargetElement } from "../lib/domTarget";

import useRafState from "./useRafState";
import useResizeObserver from "./useResizeObserver";

type Size = { height: number; width: number };

const useElementSize = (target: BasicTarget): Size => {
  const [state, setState] = useRafState<Size>(() => {
    const el = getTargetElement(target);
    return { height: el?.clientHeight ?? 0, width: el?.clientWidth ?? 0 };
  });

  useResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { clientHeight, clientWidth } = entry.target;
      setState({ height: clientHeight, width: clientWidth });
    });
  }, target);

  return state;
};

export default useElementSize;
