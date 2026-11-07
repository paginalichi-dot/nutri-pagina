import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const EASE_OUT = 'expo.out';

export { gsap, ScrollTrigger, SplitText, useGSAP };
