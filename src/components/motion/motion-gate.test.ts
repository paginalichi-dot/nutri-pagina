import { describe, expect, it } from 'vitest';
import { MOTION_GATE_FAILSAFE_MS, MOTION_GATE_SCRIPT, MOTION_PENDING_CLASS } from './motion-gate';

type Gate = { classes: Set<string>; restoration: string; delay: number | undefined; failsafe: () => void };

function runGate({ matches, pathname = '/', hash = '' }: { matches: boolean; pathname?: string; hash?: string }): Gate {
  const classes = new Set<string>();
  const timer: { run?: () => void; delay?: number } = {};
  const history = { scrollRestoration: 'auto' };
  const document = { documentElement: { classList: { add: (name: string) => classes.add(name), remove: (name: string) => classes.delete(name) } } };
  const window = { matchMedia: (query: string) => ({ matches: matches && query === '(prefers-reduced-motion: no-preference)' }) };
  const setTimeout = (run: () => void, delay: number): void => {
    Object.assign(timer, { run, delay });
  };
  new Function('document', 'window', 'setTimeout', 'location', 'history', MOTION_GATE_SCRIPT)(document, window, setTimeout, { pathname, hash }, history);
  return { classes, restoration: history.scrollRestoration, delay: timer.delay, failsafe: () => timer.run?.() };
}

describe('gate de la intro de la home', () => {
  it('en la home y sin preferencia de movimiento, oculta la intro hasta que arranque y empieza arriba', () => {
    const gate = runGate({ matches: true });
    expect(gate.classes.has(MOTION_PENDING_CLASS)).toBe(true);
    expect(gate.restoration).toBe('manual');
  });

  it('si la animación nunca arranca, la libera sola a los 2.5 s', () => {
    const gate = runGate({ matches: true });
    expect(gate.delay).toBe(MOTION_GATE_FAILSAFE_MS);
    gate.failsafe();
    expect(gate.classes.has(MOTION_PENDING_CLASS)).toBe(false);
  });

  it.each([
    { name: 'con "reducir movimiento"', matches: false, pathname: '/', hash: '' },
    { name: 'fuera de la home', matches: true, pathname: '/reservar', hash: '' },
    { name: 'si se entra a un ancla de la home', matches: true, pathname: '/', hash: '#sobre-mi' },
  ])('$name no hay intro ni se toca el scroll', ({ matches, pathname, hash }) => {
    const gate = runGate({ matches, pathname, hash });
    expect(gate.classes.size).toBe(0);
    expect(gate.restoration).toBe('auto');
  });
});
