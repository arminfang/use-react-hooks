// 通用事件监听Hook，简化DOM事件绑定和管理
import type { BasicTarget } from "../lib/domTarget";
import { getTargetElement } from "../lib/domTarget";

import useEffectWithTarget from "./useEffectWithTarget";
import useLatest from "./useLatest";

type noop = (...p: any) => void;

export type Target = BasicTarget<HTMLElement | Element | Window | Document>;

type Options<T extends Target = Target> = {
  capture?: boolean;
  enable?: boolean;
  once?: boolean;
  passive?: boolean;
  target?: T;
};

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>
): void;
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>
): void;
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>
): void;
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>
): void;
function useEventListener(
  eventName: string | string[],
  handler: (event: Event) => void,
  options?: Options<Window>
): void;
function useEventListener(
  eventName: string | string[],
  handler: noop,
  options: Options
): void;

function useEventListener(
  eventName: string | string[],
  handler: noop,
  options: Options = {}
) {
  const handlerRef = useLatest(handler);

  useEffectWithTarget(
    () => {
      const targetElement = getTargetElement(options.target, window);
      if (!targetElement?.addEventListener) {
        return;
      }

      const eventListener = (event: Event) => {
        return handlerRef(event);
      };

      const eventNameArray = Array.isArray(eventName) ? eventName : [eventName];

      eventNameArray.forEach((event) => {
        targetElement.addEventListener(event, eventListener, {
          capture: options.capture,
          once: options.once,
          passive: options.passive,
        });
      });

      return () => {
        eventNameArray.forEach((event) => {
          targetElement.removeEventListener(event, eventListener, {
            capture: options.capture,
          });
        });
      };
    },
    [eventName, options.capture, options.once, options.passive],
    options.target
  );
}

export default useEventListener;
