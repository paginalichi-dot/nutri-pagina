import { EASE_OUT, gsap, SplitText } from './gsap';

const MIN_BRAND_MS = 1600;
const READY_CAP_MS = 2500;
const MASK_AT = 0.3;
const MASK_DURATION = 1.2;
const HERO_AT = 0.7;

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

export async function introReady(photo: HTMLImageElement | null): Promise<void> {
  const loaded = Promise.all([document.fonts.ready, photo?.decode().catch(() => undefined)]);
  await Promise.race([loaded, wait(READY_CAP_MS)]);
  await wait(MIN_BRAND_MS - performance.now());
}

function insetOf(outer: Element, inner: Element): string {
  const a = outer.getBoundingClientRect();
  const b = inner.getBoundingClientRect();
  const radius = getComputedStyle(inner).borderTopLeftRadius;
  return `inset(${b.top - a.top}px ${a.right - b.right}px ${a.bottom - b.bottom}px ${b.left - a.left}px round ${radius})`;
}

function heroEntrance(root: HTMLElement, timeline: gsap.core.Timeline): void {
  const q = gsap.utils.selector(root);
  const [opening, closing] = q('[data-hero-phrase]');
  const name = SplitText.create(q('[data-hero-name]'), { type: 'chars' });
  const button = document.querySelector('[data-booking-button]');
  timeline
    .from(q('[data-hero-photo]'), { scale: 0.6, autoAlpha: 0, duration: 1.4, transformOrigin: '50% 50%' }, HERO_AT)
    .from(name.chars, { yPercent: -120, autoAlpha: 0, duration: 1, stagger: 0.035 }, HERO_AT + 0.1)
    .from(opening ?? [], { x: -120, autoAlpha: 0, duration: 1.1 }, HERO_AT + 0.3)
    .from(closing ?? [], { x: 120, autoAlpha: 0, duration: 1.1 }, HERO_AT + 0.35);
  if (button) timeline.from(button, { yPercent: 160, autoAlpha: 0, duration: 0.9 }, HERO_AT + 0.8);
}

export function introTimeline(root: HTMLElement, onRevealed: () => void): gsap.core.Timeline | null {
  const main = root.closest('main');
  const frame = root.querySelector('[data-hero-frame]');
  const box = document.querySelector('[data-preloader-box]');
  const name = document.querySelector('[data-preloader-name]');
  if (!main || !frame || !box || !name) return null;
  const timeline = gsap.timeline({ paused: true, defaults: { ease: EASE_OUT } });
  timeline
    .to(name, { yPercent: -110, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0)
    .fromTo(
      main,
      { clipPath: () => insetOf(main, box) },
      { clipPath: () => insetOf(main, frame), duration: MASK_DURATION, ease: 'power4.inOut', immediateRender: false },
      MASK_AT
    )
    .set(main, { clearProps: 'clipPath' }, MASK_AT + MASK_DURATION)
    .call(onRevealed, [], MASK_AT + MASK_DURATION);
  heroEntrance(root, timeline);
  return timeline;
}
