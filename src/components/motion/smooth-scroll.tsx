'use client';

import 'lenis/dist/lenis.css';
import { ReactLenis, useLenis } from 'lenis/react';
import { type ReactElement, useSyncExternalStore } from 'react';
import { MOTION_OK, ScrollTrigger } from './gsap';
import { isIntroRunning } from './motion-gate';

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(MOTION_OK);
  const observer = new MutationObserver(onChange);
  query.addEventListener('change', onChange);
  observer.observe(document.documentElement, { attributeFilter: ['class', 'data-intro-state'] });
  return () => {
    query.removeEventListener('change', onChange);
    observer.disconnect();
  };
}

const canSmooth = (): boolean => window.matchMedia(MOTION_OK).matches && !isIntroRunning();

function SyncScrollTrigger(): null {
  useLenis(() => ScrollTrigger.update());
  return null;
}

export function SmoothScroll(): ReactElement | null {
  const enabled = useSyncExternalStore(subscribe, canSmooth, () => false);
  if (!enabled) return null;
  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: true }}>
      <SyncScrollTrigger />
    </ReactLenis>
  );
}
