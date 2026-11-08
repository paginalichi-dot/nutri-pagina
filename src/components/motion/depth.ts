import { gsap } from './gsap';

type DepthLayer = { layer: HTMLElement; next: Element; content: Element; hold?: number };

const hidden = (layer: HTMLElement, isHidden: boolean): void => void gsap.set(layer, { autoAlpha: isHidden ? 0 : 1 });

export function depthScene({ layer, next, content, hold = 0 }: DepthLayer): gsap.core.Timeline {
  // Por qué: la pausa demora a la siguiente; si ésta no entra en pantalla, quedaría cortada arriba mientras dura.
  const pause = layer.offsetHeight <= window.innerHeight + 1 ? hold : 0;
  if (pause > 0) gsap.set(next, { marginTop: `${pause * 100}svh` });
  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: layer,
        start: 'bottom bottom',
        endTrigger: next,
        end: 'top top',
        pin: true,
        pinSpacing: false,
        scrub: 0.6,
        // Por qué: al soltarse queda detrás de la siguiente; si ésta se apaga al alejarse, se vería a través.
        onLeave: () => hidden(layer, true),
        onEnterBack: () => hidden(layer, false),
      },
    })
    .to(content, { scale: 0.9, autoAlpha: 0.5, transformOrigin: '50% 50%', duration: 1 }, pause);
}
