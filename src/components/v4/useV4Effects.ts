import { useEffect } from 'react';

/** Reveal-on-scroll, nav state, scroll progress, cursor glow and pointer-tracking card glow. */
export function useV4Effects(deps: unknown[] = []) {
  // Reveal (also picks up elements added later, e.g. after a fetch)
  useEffect(() => {
    const root = document.querySelector('.v4');
    const seen = new WeakSet<Element>();
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.v4 .reveal').forEach((e) => e.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    const scan = () => document.querySelectorAll<HTMLElement>('.v4 .reveal:not(.visible)').forEach((e) => {
      if (!seen.has(e)) { seen.add(e); io.observe(e); }
    });
    scan();
    const mo = root ? new MutationObserver(scan) : null;
    if (root) mo?.observe(root, { childList: true, subtree: true });
    return () => { io.disconnect(); mo?.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // One-time global listeners
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('.v4 .scroll-progress');
    const nav = document.querySelector<HTMLElement>('.v4 .nav');
    const glow = document.querySelector<HTMLElement>('.v4 .cursor-glow');
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
        nav?.classList.toggle('scrolled', window.scrollY > 24);
      });
    };
    const onMove = (e: PointerEvent) => {
      if (glow) glow.style.transform = `translate3d(${e.clientX - 155}px, ${e.clientY - 155}px, 0)`;
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('.product-card, .research-card');
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      const hero = document.querySelector<HTMLElement>('.v4 .bio-specimen');
      if (hero) {
        hero.style.setProperty('--pointer-x', `${(e.clientX / window.innerWidth - 0.5) * 36}px`);
        hero.style.setProperty('--pointer-y', `${(e.clientY / window.innerHeight - 0.5) * 36}px`);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
