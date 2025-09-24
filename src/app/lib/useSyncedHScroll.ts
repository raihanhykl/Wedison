import { useCallback, useRef } from "react";

function useSyncedHScroll() {
  const nodesRef = useRef<Set<HTMLDivElement>>(new Set());
  const isSyncingRef = useRef(false);

  const register = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    nodesRef.current.add(el);
    // hapus otomatis saat unmount
    return () => nodesRef.current.delete(el);
  }, []);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    const target = e.currentTarget as HTMLDivElement;
    const { scrollLeft } = target;

    nodesRef.current.forEach((node) => {
      if (node !== target) {
        node.scrollLeft = scrollLeft;
      }
    });

    // lepas flag di frame berikutnya agar smooth & anti feedback loop
    requestAnimationFrame(() => {
      isSyncingRef.current = true;
    });
  }, []);

  return { register, onScroll };
}

export default useSyncedHScroll;
