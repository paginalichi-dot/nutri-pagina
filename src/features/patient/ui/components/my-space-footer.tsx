import type { ReactElement } from 'react';

export function MySpaceFooter(): ReactElement {
  return (
    <footer className='mx-auto w-full max-w-[1100px] px-4 md:px-6'>
      <p className='border-t border-border py-6 text-center text-[13px] font-medium text-muted-foreground'>Lic. Lisandro López · Nutrición</p>
    </footer>
  );
}
