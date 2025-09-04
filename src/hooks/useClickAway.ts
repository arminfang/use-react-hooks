// 监听点击元素外部区域的事件，常用于下拉菜单、模态框等组件的关闭
import { BasicTarget, getTargetElement } from "../lib/domTarget";

import useEffectWithTarget from "./useEffectWithTarget";
import useLatest from "./useLatest";

type DocumentEventKey = keyof DocumentEventMap;

export default function useClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: DocumentEventKey | DocumentEventKey[] = "click"
) {
  const onClickAwayRef = useLatest(onClickAway);

  useEffectWithTarget(
    () => {
      const handler = (event: any) => {
        const targets = Array.isArray(target) ? target : [target];
        if (
          targets.some((item) => {
            const targetElement = getTargetElement(item);
            return !targetElement || targetElement.contains(event.target);
          })
        ) {
          return;
        }
        onClickAwayRef?.(event);
      };

      const eventNames = Array.isArray(eventName) ? eventName : [eventName];

      eventNames.forEach((event) => document.addEventListener(event, handler));

      return () => {
        eventNames.forEach((event) =>
          document.removeEventListener(event, handler)
        );
      };
    },
    Array.isArray(eventName) ? eventName : [eventName],
    target
  );
}
