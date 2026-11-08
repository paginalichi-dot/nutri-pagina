import type { ReactElement } from 'react';

export function IntroPreloader(): ReactElement {
  return (
    <div data-preloader aria-hidden='true' className='pointer-events-none fixed inset-0 z-[60] place-items-center'>
      <div data-preloader-box className='flex h-(--intro-box-h) w-(--intro-box-w) items-center justify-center overflow-hidden rounded-input'>
        <p data-preloader-name className='text-[clamp(1.375rem,5.4vw,2.125rem)] font-semibold whitespace-nowrap text-muted'>
          <span className='font-medium text-footer-text'>Lic.</span> Lisandro López
        </p>
      </div>
    </div>
  );
}
