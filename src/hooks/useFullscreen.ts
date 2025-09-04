// 控制DOM元素全屏显示的Hook，基于screenfull库
// 1. 提供进入、退出和切换全屏状态的方法
// 2. 实时监测全屏状态变化并触发相应回调
import { useCallback, useEffect, useRef, useState } from "react";
import screenfull from "screenfull";

import { BasicTarget, getTargetElement } from "../lib/domTarget";

import useLatest from "./useLatest";

export interface PageFullscreenOptions {
  className?: string;
  zIndex?: number;
}

export interface Options {
  onEnter?: () => void;
  onExit?: () => void;
}

const useFullscreen = (target: BasicTarget, options?: Options) => {
  const { onEnter, onExit } = options || {};

  const onExitRef = useLatest(onExit);
  const onEnterRef = useLatest(onEnter);

  const [state, setState] = useState(getIsFullscreen);
  const stateRef = useRef(getIsFullscreen());

  function getIsFullscreen() {
    return (
      screenfull.isEnabled &&
      !!screenfull.element &&
      screenfull.element === getTargetElement(target)
    );
  }

  const invokeCallback = (fullscreen: boolean) => {
    if (fullscreen) {
      onEnterRef?.();
    } else {
      onExitRef?.();
    }
  };

  const updateFullscreenState = (fullscreen: boolean) => {
    // Prevent repeated calls when the state is not changed.
    if (stateRef.current !== fullscreen) {
      invokeCallback(fullscreen);
      setState(fullscreen);
      stateRef.current = fullscreen;
    }
  };

  const onScreenfullChange = () => {
    const fullscreen = getIsFullscreen();

    updateFullscreenState(fullscreen);
  };

  const enterFullscreen = useCallback(() => {
    const el = getTargetElement(target);
    if (!el) {
      return;
    }

    if (screenfull.isEnabled) {
      try {
        screenfull.request(el);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const exitFullscreen = () => {
    const el = getTargetElement(target);
    if (!el) {
      return;
    }

    if (screenfull.isEnabled && screenfull.element === el) {
      screenfull.exit();
    }
  };

  const toggleFullscreen = () => {
    if (state) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useEffect(() => {
    if (!screenfull.isEnabled) {
      return;
    }

    screenfull.on("change", onScreenfullChange);

    return () => {
      screenfull.off("change", onScreenfullChange);
    };
  }, []);

  return [
    state,
    {
      enterFullscreen,
      exitFullscreen,
      isEnabled: screenfull.isEnabled,
      toggleFullscreen,
    },
  ] as const;
};

export default useFullscreen;
