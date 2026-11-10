import type { ReactElement } from 'react';
import { shortDate } from '@/lib/format-date-time';
import type { DirectoryEntry } from '../../domain/patient-directory.schema';
import { NextVisit, PatientName, PatientStatusChip, RowActions } from './patient-row';

const HEAD = 'px-4 py-3 text-left text-[12px] font-semibold tracking-[1px] text-muted-foreground uppercase';

const COLUMNS = ['Paciente', 'Teléfono', 'Último turno', 'Próximo turno', 'Estado'] as const;

function TableHead(): ReactElement {
  return (
    <thead>
      <tr className='border-b border-border'>
        {COLUMNS.map((column) => (
          <th key={column} scope='col' className={HEAD}>
            {column}
          </th>
        ))}
        <th scope='col' className={HEAD}>
          <span className='sr-only'>Acciones</span>
        </th>
      </tr>
    </thead>
  );
}

function DesktopTable({ rows }: { rows: DirectoryEntry[] }): ReactElement {
  return (
    <table className='hidden w-full md:table'>
      <caption className='sr-only'>Pacientes</caption>
      <TableHead />
      <tbody>
        {rows.map((entry, index) => (
          <tr key={entry.id} className='border-b border-border last:border-b-0'>
            <td className='max-w-72 px-4 py-3'>
              <PatientName entry={entry} dark={index % 2 === 1} />
            </td>
            <td className='px-4 py-3 whitespace-nowrap'>{entry.phone}</td>
            <td className='px-4 py-3 whitespace-nowrap'>{entry.lastVisit ? shortDate(entry.lastVisit) : <span className='text-muted-foreground'>—</span>}</td>
            <td className='px-4 py-3 whitespace-nowrap'>
              <NextVisit value={entry.nextVisit} />
            </td>
            <td className='px-4 py-3'>
              <PatientStatusChip status={entry.status} />
            </td>
            <td className='px-2 py-3'>
              <RowActions entry={entry} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MobileCards({ rows }: { rows: DirectoryEntry[] }): ReactElement {
  return (
    <ul aria-label='Pacientes' className='flex flex-col md:hidden'>
      {rows.map((entry, index) => (
        <li key={entry.id} className='flex flex-col gap-3 border-b border-border py-4 last:border-b-0'>
          <div className='flex items-start justify-between gap-3'>
            <PatientName entry={entry} dark={index % 2 === 1} />
            <PatientStatusChip status={entry.status} />
          </div>
          <dl className='grid grid-cols-2 gap-2 text-[14px]'>
            <dt className='text-muted-foreground'>Teléfono</dt>
            <dd>{entry.phone}</dd>
            <dt className='text-muted-foreground'>Último turno</dt>
            <dd>{entry.lastVisit ? shortDate(entry.lastVisit) : '—'}</dd>
            <dt className='text-muted-foreground'>Próximo turno</dt>
            <dd>
              <NextVisit value={entry.nextVisit} />
            </dd>
          </dl>
          <RowActions entry={entry} />
        </li>
      ))}
    </ul>
  );
}

export function PatientTable({ rows }: { rows: DirectoryEntry[] }): ReactElement {
  return (
    <>
      <DesktopTable rows={rows} />
      <MobileCards rows={rows} />
    </>
  );
}
