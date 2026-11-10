'use client';

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { FOCUS, INPUT } from '@/components/form/form-parts';
import type { DirectoryEntry } from '../../domain/patient-directory.schema';
import { directoryPage, FILTERS, type FilterId, PAGE_SIZE } from './directory-filter';
import { PatientTable } from './patient-table';

const CONTROL = `hover-shade flex h-11 shrink-0 items-center justify-center rounded-control px-4 text-[15px] font-semibold ${FOCUS}`;

function Pager({ page, pages, total, onPage }: { page: number; pages: number; total: number; onPage: (page: number) => void }): ReactElement {
  const first = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  return (
    <nav aria-label='Páginas' className='flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4'>
      <p className='text-[14px] text-muted-foreground'>
        Mostrando {first}–{Math.min(page * PAGE_SIZE, total)} de {total}
      </p>
      <div className='flex items-center gap-2'>
        <button type='button' aria-label='Página anterior' disabled={page <= 1} onClick={() => onPage(page - 1)} className={`${CONTROL} border border-border px-3 disabled:opacity-40`}>
          <ChevronLeft aria-hidden='true' className='size-5' strokeWidth={2} />
        </button>
        <span aria-current='page' className='flex h-11 min-w-11 items-center justify-center rounded-control bg-foreground px-3 font-semibold text-background'>
          {page}
        </span>
        <span className='text-[14px] text-muted-foreground'>de {pages}</span>
        <button type='button' aria-label='Página siguiente' disabled={page >= pages} onClick={() => onPage(page + 1)} className={`${CONTROL} border border-border px-3 disabled:opacity-40`}>
          <ChevronRight aria-hidden='true' className='size-5' strokeWidth={2} />
        </button>
      </div>
    </nav>
  );
}

export function PatientDirectory({ entries }: { entries: DirectoryEntry[] }): ReactElement {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterId>('all');
  const [page, setPage] = useState(1);
  const view = directoryPage(entries, { query, filter, page });
  const search = (value: string): void => {
    setQuery(value);
    setPage(1);
  };
  const choose = (id: FilterId): void => {
    setFilter(id);
    setPage(1);
  };
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
        <label className='relative flex-1'>
          <span className='sr-only'>Buscar por nombre, email o teléfono</span>
          <Search aria-hidden='true' className='pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground' strokeWidth={2} />
          <input type='search' value={query} onChange={(event) => search(event.target.value)} placeholder='Buscar por nombre, email o teléfono…' className={`${INPUT} bg-background pl-12`} />
        </label>
        <div role='group' aria-label='Filtrar pacientes' className='flex gap-2 overflow-x-auto'>
          {FILTERS.map(({ id, label }) => (
            <button key={id} type='button' aria-pressed={filter === id} onClick={() => choose(id)} className={`${CONTROL} ${filter === id ? 'hover-shade-on-dark bg-foreground text-background' : 'bg-background'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <section aria-label='Lista de pacientes' className='flex flex-col gap-2 rounded-panel bg-background p-4 md:p-6'>
        {view.rows.length === 0 ? <p className='py-6 text-center text-muted-foreground'>{entries.length === 0 ? 'Todavía no tenés pacientes. Aparecen con su primer turno o al crear su cuenta.' : 'No hay pacientes que coincidan.'}</p> : <PatientTable rows={view.rows} />}
        <Pager page={view.page} pages={view.pages} total={view.total} onPage={setPage} />
      </section>
    </div>
  );
}
