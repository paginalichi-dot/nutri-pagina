import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Emphasis, NoticePage } from './notice-page';

describe('NoticePage', () => {
  it('muestra el título, el mensaje y un solo link, que vuelve al inicio', () => {
    render(
      <NoticePage
        title={
          <>
            Reservá tu <Emphasis>turno</Emphasis>
          </>
        }
        message='La reserva online está por llegar.'
      />
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Reservá tu turno');
    expect(screen.getByText('La reserva online está por llegar.')).toBeDefined();
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Volver al inicio' }).getAttribute('href')).toBe('/');
  });
});
