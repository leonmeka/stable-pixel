import { type ImageSize } from "@/types";
import { useState, useEffect } from "react";

export const useImageSize = (ref: React.RefObject<HTMLDivElement>) => {
  const [size, setSize] = useState<ImageSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        });
      }
    };

    const observer = new ResizeObserver(() => updateSize());

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, [ref]);

  return size;
};
