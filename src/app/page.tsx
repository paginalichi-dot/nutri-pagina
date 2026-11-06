import type { ReactElement } from 'react';
import { Hero } from '@/components/home/hero';

export default function Home(): ReactElement {
  return (
    <main className='flex flex-1 flex-col'>
      <Hero />
    </main>
  );
}
