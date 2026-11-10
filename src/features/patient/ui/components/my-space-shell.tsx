import type { ReactElement, ReactNode } from 'react';
import { MySpaceFooter } from './my-space-footer';
import { MySpaceTopBar } from './my-space-top-bar';

const WIDTHS = {
  narrow: 'max-w-[900px] gap-8 px-4 py-10 md:px-6 md:py-12',
  wide: 'max-w-[1180px] gap-8 px-4 py-10 md:px-6 md:py-12',
} as const;

type ShellProps = { name: string; width?: keyof typeof WIDTHS; enter?: boolean; children: ReactNode };

export function MySpaceShell({ name, width = 'narrow', enter = false, children }: ShellProps): ReactElement {
  return (
    <div className='flex min-h-svh flex-col bg-muted'>
      <div data-enter={enter ? 'top' : undefined} className='relative z-10'>
        <MySpaceTopBar name={name} />
      </div>
      <main className={`mx-auto flex w-full flex-1 flex-col ${WIDTHS[width]}`}>{children}</main>
      <MySpaceFooter />
    </div>
  );
}
