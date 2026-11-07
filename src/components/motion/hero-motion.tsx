'use client';

import { type ReactElement, type ReactNode, useRef } from 'react';
import { EASE_OUT, gsap, MOTION_OK, SplitText, useGSAP } from './gsap';
import { releaseMotionGate } from './motion-gate';

function intro(root: HTMLElement): void {
  const q = gsap.utils.selector(root);
  const [opening, closing] = q('[data-hero-phrase]');
  const name = SplitText.create(q('[data-hero-name]'), { type: 'chars' });
  const button = document.querySelector('[data-booking-button]');
  const timeline = gsap.timeline({ defaults: { ease: EASE_OUT } });
  timeline
    .from(q('[data-hero-photo]'), { yPercent: 45, scale: 0.9, autoAlpha: 0, duration: 1.4 }, 0)
    .from(name.chars, { yPercent: -120, autoAlpha: 0, duration: 1, stagger: 0.035 }, 0.15)
    .from(opening ?? [], { x: 120, autoAlpha: 0, duration: 1.1 }, 0.45)
    .from(closing ?? [], { x: -120, autoAlpha: 0, duration: 1.1 }, 0.5);
  if (button) timeline.from(button, { yPercent: 160, autoAlpha: 0, duration: 0.9 }, 0.9);
}

function scrollScene(root: HTMLElement): void {
  const q = gsap.utils.selector(root);
  const frame = q('[data-hero-frame]')[0];
  if (!frame) return;
  gsap
    .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: frame, start: 'top top', end: 'bottom top', scrub: 0.8 } })
    .to(q('[data-hero-photo] img'), { scale: 1.08, yPercent: 8, transformOrigin: '50% 100%' }, 0)
    .to(q('[data-hero-name]'), { yPercent: -45, autoAlpha: 0.25 }, 0)
    .to(frame, { scale: 0.94, transformOrigin: '50% 0%' }, 0);
}

export function HeroMotion({ children }: { children: ReactNode }): ReactElement {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        if (!scope.current) return;
        intro(scope.current);
        scrollScene(scope.current);
      });
      releaseMotionGate();
      return () => media.revert();
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
