import type { DirectoryEntry } from '../../domain/patient-directory.schema';

export const PAGE_SIZE = 20;

export const FILTERS = [
  { id: 'all', label: 'Todos', keep: (): boolean => true },
  { id: 'active', label: 'Activos', keep: (entry: DirectoryEntry): boolean => entry.status === 'ACTIVE' },
  { id: 'new', label: 'Nuevos este mes', keep: (entry: DirectoryEntry): boolean => entry.status === 'NEW' },
  { id: 'no-next', label: 'Sin turno próximo', keep: (entry: DirectoryEntry): boolean => entry.nextVisit === null },
] as const;

export type FilterId = (typeof FILTERS)[number]['id'];

const plain = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

function matches(entry: DirectoryEntry, query: string): boolean {
  const text = plain(query.trim());
  if (text === '') return true;
  const digits = text.replace(/\D/g, '');
  if (plain(entry.name).includes(text) || plain(entry.email ?? '').includes(text)) return true;
  return digits.length > 0 && digits === text.replace(/[\s+()-]/g, '') && entry.phone.replace(/\D/g, '').includes(digits);
}

export type DirectoryPage = { rows: DirectoryEntry[]; total: number; page: number; pages: number };

export function directoryPage(entries: DirectoryEntry[], { query, filter, page }: { query: string; filter: FilterId; page: number }): DirectoryPage {
  const keep = FILTERS.find(({ id }) => id === filter)?.keep ?? ((): boolean => true);
  const found = entries.filter((entry) => keep(entry) && matches(entry, query));
  const pages = Math.max(1, Math.ceil(found.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  return { rows: found.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), total: found.length, page: current, pages };
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}
