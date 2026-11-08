import { describe, expect, it } from 'vitest';
import { escapeHtml, renderEmail } from './render-email';

const CONTENT = {
  title: 'Tu turno está confirmado',
  paragraphs: ['Hola Ana, te esperamos.'],
  details: [['Ubicación', 'Consultorio <Centro>']] as const,
  action: { label: 'Cómo llegar', url: 'https://www.google.com/maps?q=a&b' },
};

describe('renderEmail', () => {
  it('arma el HTML con la marca, los datos escapados y el botón', () => {
    const { html } = renderEmail(CONTENT);
    expect(html).toContain('<h1 style="margin:0 0 16px;font-size:24px;font-weight:500">Tu turno está confirmado</h1>');
    expect(html).toContain('Consultorio &lt;Centro&gt;');
    expect(html).toContain('href="https://www.google.com/maps?q=a&amp;b"');
    expect(html).toContain('background:rgb(163, 230, 53)');
    expect(html).toContain('Lisandro López · Licenciado en Nutrición');
  });

  it('arma la versión en texto plano con los mismos datos', () => {
    expect(renderEmail(CONTENT).text).toBe(
      ['Tu turno está confirmado', '', 'Hola Ana, te esperamos.', '', 'Ubicación: Consultorio <Centro>', 'Cómo llegar: https://www.google.com/maps?q=a&b', '', 'Lisandro López · Licenciado en Nutrición'].join('\n')
    );
  });

  it('sin detalles ni botón no los muestra', () => {
    const { html, text } = renderEmail({ title: 'T', paragraphs: ['P'] });
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('<tr>');
    expect(text).toBe(['T', '', 'P', '', '', 'Lisandro López · Licenciado en Nutrición'].join('\n'));
  });
});

describe('escapeHtml', () => {
  it('escapa los cinco caracteres especiales', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });
});
