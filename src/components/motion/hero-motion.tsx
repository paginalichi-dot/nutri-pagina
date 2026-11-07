'use client';

import { type ReactElement, type ReactNode, useRef } from 'react';
import { depthScene } from './depth';
import { gsap, MOTION_OK, useGSAP } from './gsap';
import { introReady, introTimeline } from './intro-timeline';
import { claimIntro, finishIntro, releaseMotionGate } from './motion-gate';

function scrollScene(root: HTMLElement): void {
  const q = gsap.utils.selector(root);
  const [frame, next] = [q('[data-hero-frame]')[0], root.nextElementSibling];
  if (!frame || !next) return;
  depthScene({ layer: root, next, content: frame })
    .to(q('[data-hero-photo] img'), { scale: 1.08, transformOrigin: '50% 100%' }, 0)
    .to(q('[data-hero-name]'), { yPercent: -45, autoAlpha: 0.25 }, 0);
}

function playIntro(root: HTMLElement, isCancelled: () => boolean): void {
  const timeline = introTimeline(root, finishIntro);
  if (!timeline) return finishIntro();
  void introReady(root.querySelector('[data-hero-photo] img')).then(() => {
    if (!isCancelled()) timeline.play();
  });
}

export function HeroMotion({ children }: { children: ReactNode }): ReactElement {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let cancelled = false;
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        if (!scope.current) return;
        if (claimIntro()) playIntro(scope.current, () => cancelled);
        scrollScene(scope.current);
      });
      releaseMotionGate();
      return () => {
        cancelled = true;
        media.revert();
      };
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
