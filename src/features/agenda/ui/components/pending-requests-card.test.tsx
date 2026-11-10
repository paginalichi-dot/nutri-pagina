import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PendingRequestsCard } from './pending-requests-card';

describe('PendingRequestsCard (US-39 CA-1)', () => {
  it('sin solicitudes no se muestra', () => {
    const { container } = render(<PendingRequestsCard count={0} />);
    expect(container.textContent).toBe('');
  });

  it('dice cuántas hay y lleva a Solicitudes', () => {
    const { rerender } = render(<PendingRequestsCard count={1} />);
    expect(screen.getByText('Tenés 1 solicitud por confirmar')).toBeDefined();
    rerender(<PendingRequestsCard count={4} />);
    expect(screen.getByText('Tenés 4 solicitudes por confirmar')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Ver solicitudes' }).getAttribute('href')).toBe('/admin/solicitudes');
  });
});
