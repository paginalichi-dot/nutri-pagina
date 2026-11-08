import { LogOut } from 'lucide-react';
import type { ReactElement } from 'react';
import { logout } from '../../actions/logout';

export function LogoutButton({ onDark = false }: { onDark?: boolean }): ReactElement {
  const tone = onDark
    ? 'text-footer-text hover:text-background focus-visible:outline-primary'
    : 'bg-secondary text-secondary-foreground focus-visible:outline-foreground';
  return (
    <form action={logout}>
      <button type='submit' className={`flex h-12 items-center gap-3 rounded-full px-4 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${tone}`}>
        <LogOut aria-hidden='true' className='size-5' strokeWidth={2} />
        Cerrar sesión
      </button>
    </form>
  );
}
