import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MINUTE_HEIGHT } from "../types/event";
import { getMinutesFromMidnight } from "../utils/date";

const useCalendarScroll = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrollbarW, setScrollbarW] = useState(0);

  const handleGridScroll = useCallback(() => {
    if (gridRef.current && headerRef.current) {
      headerRef.current.scrollLeft = gridRef.current.scrollLeft;
    }
  }, []);

  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const measure = () => setScrollbarW(el.offsetWidth - el.clientWidth);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const initialMinutes = getMinutesFromMidnight(new Date());
    el.scrollTop = Math.max(0, initialMinutes * MINUTE_HEIGHT - 120);
  }, []);

  return {
    headerRef,
    gridRef,
    scrollbarW,
    handleGridScroll,
  };
};

export default useCalendarScroll;
