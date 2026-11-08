export const MOTION_PENDING_CLASS = 'motion-pending';

export const MOTION_GATE_FAILSAFE_MS = 2500;

export const MOTION_GATE_SCRIPT = `(function(){var d=document.documentElement;if(location.pathname==='/'&&!location.hash&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: no-preference)').matches){d.classList.add('${MOTION_PENDING_CLASS}');history.scrollRestoration='manual';setTimeout(function(){d.classList.remove('${MOTION_PENDING_CLASS}')},${MOTION_GATE_FAILSAFE_MS})}})();`;

export function releaseMotionGate(): void {
  document.documentElement.classList.remove(MOTION_PENDING_CLASS);
}

export function isIntroRunning(): boolean {
  const root = document.documentElement;
  return root.classList.contains(MOTION_PENDING_CLASS) || root.dataset.introState === 'playing';
}

export function claimIntro(): boolean {
  if (!isIntroRunning()) return false;
  document.documentElement.dataset.introState = 'playing';
  window.scrollTo(0, 0);
  return true;
}

export function finishIntro(): void {
  document.documentElement.dataset.introState = 'done';
}
