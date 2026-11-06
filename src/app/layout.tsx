import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import type { ReactElement, ReactNode } from 'react';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Lisandro López · Nutrición',
  description: 'Licenciado en Nutrición. Reservá tu turno online.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <html
      lang='es-AR'
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>{children}</body>
    </html>
  );
}
