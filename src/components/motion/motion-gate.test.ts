import { describe, expect, it } from 'vitest';
import { MOTION_GATE_FAILSAFE_MS, MOTION_GATE_SCRIPT, MOTION_PENDING_CLASS } from './motion-gate';

function runGate(matches: boolean): { classes: Set<string>; delay: number | undefined; failsafe: () => void } {
  const classes = new Set<string>();
  const timer: { run?: () => void; delay?: number } = {};
  const document = { documentElement: { classList: { add: (name: string) => classes.add(name), remove: (name: string) => classes.delete(name) } } };
  const window = { matchMedia: (query: string) => ({ matches: matches && query === '(prefers-reduced-motion: no-preference)' }) };
  const setTimeout = (run: () => void, delay: number): void => {
    Object.assign(timer, { run, delay });
  };
  new Function('document', 'window', 'setTimeout', MOTION_GATE_SCRIPT)(document, window, setTimeout);
  return { classes, delay: timer.delay, failsafe: () => timer.run?.() };
}

describe('gate de la entrada del hero', () => {
  it('sin preferencia de movimiento oculta la intro hasta que arranque', () => {
    expect(runGate(true).classes.has(MOTION_PENDING_CLASS)).toBe(true);
  });

  it('si la animación nunca arranca, la libera sola a los 2.5 s', () => {
    const gate = runGate(true);
    expect(gate.delay).toBe(MOTION_GATE_FAILSAFE_MS);
    gate.failsafe();
    expect(gate.classes.has(MOTION_PENDING_CLASS)).toBe(false);
  });

  it('con "reducir movimiento" no oculta nada', () => {
    expect(runGate(false).classes.size).toBe(0);
  });
});
