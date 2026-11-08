'use client';

import { type ReactElement, type ReactNode, useRef } from 'react';
import { depthScene } from './depth';
import { EASE_OUT, gsap, MOTION_OK, SplitText, useGSAP } from './gsap';

const HOLD_SCREENS = 1.25;

const once = (trigger: Element, start = 'top 85%'): ScrollTrigger.Vars => ({ trigger, start, once: true });

function revealText(title: Element, lead: Element): void {
  SplitText.create(title, {
    type: 'words',
    mask: 'words',
    onSplit: (split) => gsap.from(split.words, { yPercent: 110, duration: 0.9, ease: EASE_OUT, stagger: 0.08, scrollTrigger: once(title) }),
  });
  SplitText.create(lead, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: (split) => gsap.from(split.lines, { yPercent: 110, duration: 1, ease: EASE_OUT, stagger: 0.1, scrollTrigger: once(lead) }),
  });
}

function reveal(root: HTMLElement): void {
  const q = gsap.utils.selector(root);
  const [title, lead, body, frame] = ['[data-about-title]', '[data-about-lead]', '[data-about-body]', '[data-about-frame]'].map((selector) => q(selector)[0]);
  if (!title || !lead || !body || !frame) return;
  revealText(title, lead);
  gsap.from(body, { autoAlpha: 0, y: 32, duration: 1, ease: EASE_OUT, scrollTrigger: once(body, 'top 88%') });
  gsap.from(frame, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: EASE_OUT, scrollTrigger: once(frame, 'top 80%') });
  gsap.from(q('[data-draw]'), { drawSVG: '0%', ease: 'none', stagger: 0.15, scrollTrigger: { trigger: title, start: 'top 85%', end: 'top 35%', scrub: 1 } });
  const [section, next] = [root.firstElementChild, root.nextElementSibling];
  if (section && next?.matches('section')) depthScene({ layer: root, next, content: section, hold: HOLD_SCREENS });
}

export function AboutMotion({ children }: { children: ReactNode }): ReactElement {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        if (scope.current) reveal(scope.current);
      });
      return () => media.revert();
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
