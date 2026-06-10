/**
 * Animated in-page scroll with a controlled duration — the native CSS
 * `scroll-behavior: smooth` finishes almost instantly on long distances,
 * so anchor clicks feel like a jump. Duration scales with distance
 * (~0.6s short hop … 1.5s full page), easeInOutCubic.
 */
export function smoothScrollToEl(el: Element, offset = 88) {
  const startY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + startY - offset;
  const dist = Math.abs(targetY - startY);

  if (
    dist < 4 ||
    (typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    window.scrollTo(0, targetY);
    return;
  }

  const duration = Math.min(1500, 600 + dist * 0.1);
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Take over from CSS smooth-scroll for the animation.
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  // Fail-safe: if rAF is throttled to zero (hidden/janky tab), still land.
  const failSafe = window.setTimeout(() => {
    window.scrollTo(0, targetY);
    html.style.scrollBehavior = prev;
  }, duration + 150);

  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, startY + (targetY - startY) * ease(p));
    if (p < 1) requestAnimationFrame(step);
    else {
      window.clearTimeout(failSafe);
      html.style.scrollBehavior = prev;
    }
  };
  requestAnimationFrame(step);
}
