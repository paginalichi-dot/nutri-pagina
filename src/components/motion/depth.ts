import { gsap } from './gsap';

type DepthLayer = { layer: HTMLElement; next: Element; content: Element };

export function depthScene({ layer, next, content }: DepthLayer): gsap.core.Timeline {
  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: layer, start: 'bottom bottom', endTrigger: next, end: 'top top', pin: true, pinSpacing: false, scrub: 0.6 },
    })
    .to(content, { scale: 0.9, autoAlpha: 0.5, transformOrigin: '50% 50%' }, 0);
}
