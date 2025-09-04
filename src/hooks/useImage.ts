import { useCallback, useEffect, useState } from "react";

import { loadImage } from "../lib/utils";

type ImageStatus = "loading" | "loaded" | "error";

interface UseImageOptions {
  crossOrigin?: "anonymous" | "use-credentials";
  onError?: () => void;
  onLoad?: () => void;
}

interface UseImageResult {
  aspectRatio: number | null;
  height: number | null;
  status: ImageStatus;
  width: number | null;
}

/**
 * 图片处理Hook，提供图片加载状态、尺寸信息和错误处理
 * @param imageSrc 初始图片地址
 * @param options 配置选项
 * @returns 图片状态和控制方法
 */
const useImage = (
  imageSrc: string,
  options: UseImageOptions = {}
): UseImageResult => {
  const [status, setStatus] = useState<ImageStatus>("loading");
  const [dimensions, setDimensions] = useState<{
    aspectRatio: number;
    height: number;
    width: number;
  }>({
    aspectRatio: 1,
    height: 0,
    width: 0,
  });

  const memorizedLoadImage = useCallback((src: string) => {
    setStatus("loading");
    setDimensions({
      aspectRatio: 1,
      height: 0,
      width: 0,
    });
    loadImage(src)
      .then((res) => {
        const { aspectRatio, height, width } = res;
        setStatus("loaded");
        setDimensions({
          aspectRatio,
          height,
          width,
        });
        options.onLoad?.();
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        options.onError?.();
      });
  }, []);

  useEffect(() => {
    memorizedLoadImage(imageSrc);
  }, [imageSrc]);

  return {
    aspectRatio: dimensions.aspectRatio,
    height: dimensions.height,
    status,
    width: dimensions.width,
  };
};

export default useImage;
