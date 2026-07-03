import { useEffect, useRef, useState } from 'react';

// Counts from 0 up to `end` over `duration` ms, but only once `start` becomes
// true (so it can be triggered when a stat scrolls into view). Uses an
// ease-out curve and requestAnimationFrame. Honors reduced-motion by jumping
// straight to the final value.
export default function useCountUp(end, { duration = 1600, start = true } = {}) {
  const [value, setValue] = useState(0);
  const frame = useRef(0);
  const startTime = useRef(0);

  useEffect(() => {
    if (!start) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setValue(end);
      return undefined;
    }

    const tick = (now) => {
      if (!startTime.current) startTime.current = now;
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(end * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [end, duration, start]);

  return value;
}
