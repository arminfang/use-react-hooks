import { DependencyList } from "react";

export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === "object";
export const isFunction = (value: unknown): value is (...args: any) => any =>
  typeof value === "function";
export const isString = (value: unknown): value is string =>
  typeof value === "string";
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";
export const isUndef = (value: unknown): value is undefined =>
  typeof value === "undefined";

export const isBrowser = () =>
  !!(typeof window !== "undefined" && window.document);

export const depsAreSame = (
  oldDeps: DependencyList,
  deps: DependencyList
): boolean => {
  if (oldDeps === deps) {
    return true;
  }
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) {
      return false;
    }
  }
  return true;
};

interface ImageResult {
  aspectRatio: number;
  height: number;
  src: string;
  width: number;
}

export const loadImage = (src: string): Promise<ImageResult> => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error("Source URL is required"));
      return;
    }

    const img = new Image();

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };

    img.onload = () => {
      cleanup();
      resolve({
        aspectRatio: img.naturalWidth / img.naturalHeight,
        height: img.height,
        src,
        width: img.width,
      });
    };

    // 图片加载失败
    img.onerror = () => {
      cleanup();
      reject(new Error(`Failed to load image from ${src}`));
    };

    img.src = src;

    if (img.complete) {
      setTimeout(() => {
        img.onload?.(new Event("load"));
      }, 0);
    }
  });
};
