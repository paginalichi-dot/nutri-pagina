import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '[Nombre] · Nutrición',
  description: 'Licenciado en Nutrición. Reservá tu turno online.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <html
      lang='es-AR'
      className='h-full antialiased'
    >
      <body className='flex min-h-full flex-col'>{children}</body>
    </html>
  );
}
