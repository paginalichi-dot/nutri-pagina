import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '@/components/form/form-parts';
import { SQUARE } from '@/features/agenda/ui/components/agenda-toolbar';

const css = readFileSync('src/app/hover-shade.css', 'utf8').replace(/\s+/g, ' ');

describe('hover-shade.css (US-26 CA-11)', () => {
  it('al pasar el mouse, el control se funde hacia un tono más oscuro de su propio color', () => {
    expect(css).toContain('--shade: color-mix(in oklab, var(--foreground) 16%, transparent);');
    expect(css).toContain('background-image: linear-gradient(to right, transparent, var(--shade));');
  });

  it('sobre Verde Bosque se funde hacia un tono más claro', () => {
    expect(css).toContain('.hover-shade-on-dark { --shade: color-mix(in oklab, var(--background) 14%, transparent); }');
  });

  it('aparece con un fundido de 200 ms, sólo con mouse y nunca en un botón deshabilitado', () => {
    expect(css).toContain('transition: opacity 200ms cubic-bezier(0.22, 1, 0.36, 1);');
    expect(css).toContain('@media (hover: hover) { .hover-shade:not(:disabled):hover::before { opacity: 1; } }');
  });

  it('lo llevan los botones del panel y las flechas', () => {
    for (const button of [PRIMARY_BUTTON, SECONDARY_BUTTON, SQUARE]) expect(button.split(' ')).toContain('hover-shade');
  });
});
