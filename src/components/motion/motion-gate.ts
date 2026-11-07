export const MOTION_PENDING_CLASS = 'motion-pending';

export const MOTION_GATE_FAILSAFE_MS = 2500;

export const MOTION_GATE_SCRIPT = `(function(){var d=document.documentElement;if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: no-preference)').matches){d.classList.add('${MOTION_PENDING_CLASS}');setTimeout(function(){d.classList.remove('${MOTION_PENDING_CLASS}')},${MOTION_GATE_FAILSAFE_MS})}})();`;

export function releaseMotionGate(): void {
  document.documentElement.classList.remove(MOTION_PENDING_CLASS);
}
