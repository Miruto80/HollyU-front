import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      const page = target?.closest('main');

      if (!target) return;

      target.scrollIntoView({ behavior: 'auto', block: 'start' });

      if (!page || typeof ResizeObserver === 'undefined') return;

      let previousTop = target.getBoundingClientRect().top;
      const observer = new ResizeObserver(() => {
        const currentTop = target.getBoundingClientRect().top;
        if (Math.abs(currentTop - previousTop) > 1) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
        previousTop = target.getBoundingClientRect().top;
      });
      observer.observe(page);

      const stopObserving = () => observer.disconnect();
      const userInteractions = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
      userInteractions.forEach((event) => {
        window.addEventListener(event, stopObserving, { once: true, passive: true });
      });

      return () => {
        observer.disconnect();
        userInteractions.forEach((event) => {
          window.removeEventListener(event, stopObserving);
        });
      };
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}
