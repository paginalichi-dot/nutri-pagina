'use client';

import 'lenis/dist/lenis.css';
import { ReactLenis, useLenis } from 'lenis/react';
import { type ReactElement, useSyncExternalStore } from 'react';
import { MOTION_OK, ScrollTrigger } from './gsap';

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(MOTION_OK);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const prefersMotion = (): boolean => window.matchMedia(MOTION_OK).matches;

function SyncScrollTrigger(): null {
  useLenis(() => ScrollTrigger.update());
  return null;
}

export function SmoothScroll(): ReactElement | null {
  const enabled = useSyncExternalStore(subscribe, prefersMotion, () => false);
  if (!enabled) return null;
  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: true }}>
      <SyncScrollTrigger />
    </ReactLenis>
  );
}
