"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}): {
  ref: RefObject<HTMLElement>;
  isInView: boolean;
} {
  const [isInView, setIsInView] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        if (isElementIntersecting || !freezeOnceVisible) {
          setIsInView(isElementIntersecting);
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { ref: ref as RefObject<HTMLElement>, isInView };
}
