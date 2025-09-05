/**
 * @file useStickyScroll — detects “stuck to bottom” in a scroll container
 * and provides an imperative `scrollToBottom` helper.
 */
import * as React from "react";

export function useStickyScroll<T extends HTMLElement>(bottomThreshold = 24) {
  const ref = React.useRef<T | null>(null);
  const [stuck, setStuck] = React.useState(true);

  const computeIsAtBottom = React.useCallback(() => {
    const el = ref.current;
    if (!el) return true;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= bottomThreshold;
  }, [bottomThreshold]);

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setStuck(computeIsAtBottom());
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [computeIsAtBottom]);

  return { ref, stuck, scrollToBottom };
}
