// 一个使用requestAnimationFrame进行调度的状态设置Hook，适用于需要高频更新状态但又不希望引起过多重渲染的场景。
// 使用方法和 useState 完全一致
// 注意：由于状态更新被延迟到浏览器的下一帧，所以状态不会立即更新，可能会导致一些延迟。

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

function useRafState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>];
function useRafState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
];

function useRafState<S>(initialState?: S | (() => S)) {
  const ref = useRef(0);
  const [state, setState] = useState(initialState);

  const setRafState = useCallback((value: SetStateAction<S | undefined>) => {
    cancelAnimationFrame(ref.current);

    ref.current = requestAnimationFrame(() => {
      setState(value);
    });
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(ref.current);
    },
    [],
  );

  return [state, setRafState] as const;
}

export default useRafState;
