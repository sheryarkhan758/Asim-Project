import { useEffect, useRef, useState } from 'react';

// Reveal-on-scroll: returns a ref to attach to an element and a boolean that
// flips to true the first time the element scrolls into view. Pair with the
// `.ff-reveal` / `.is-visible` classes in animations.css. Fires once, then
// disconnects the observer. Falls back to visible if IntersectionObserver is
// unavailable (very old browsers / SSR).
export default function useReveal({ threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
}
