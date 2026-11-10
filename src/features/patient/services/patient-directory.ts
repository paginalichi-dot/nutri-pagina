import { argentinaDay } from '@/lib/format-date-time';
import type { DirectoryAccount, DirectoryEntry, DirectoryVisit, PatientStatus } from '../domain/patient-directory.schema';

export type PatientGroup = { entry: DirectoryEntry; visits: DirectoryVisit[] };

const INACTIVE_MONTHS = 6;

const groupKey = (email: string | null, phone: string): string => (email ? `email:${email.toLowerCase()}` : `phone:${phone.replace(/\D/g, '')}`);
const sameMonth = (value: Date, now: Date): boolean => argentinaDay(value).slice(0, 7) === argentinaDay(now).slice(0, 7);
const isUpcoming = (visit: DirectoryVisit, now: Date): boolean => visit.startsAt >= now && (visit.status === 'PENDING' || visit.status === 'CONFIRMED');
const isPastVisit = (visit: DirectoryVisit, now: Date): boolean => visit.startsAt < now && visit.status !== 'CANCELLED';

function monthsBefore(now: Date, months: number): Date {
  const date = new Date(now);
  date.setUTCMonth(date.getUTCMonth() - months);
  return date;
}

type StatusFacts = { since: Date | null; lastVisit: Date | null; nextVisit: Date | null };

export function patientStatus({ since, lastVisit, nextVisit }: StatusFacts, now: Date): PatientStatus {
  if (since && sameMonth(since, now)) return 'NEW';
  if (!nextVisit && (!lastVisit || lastVisit < monthsBefore(now, INACTIVE_MONTHS))) return 'INACTIVE';
  return 'ACTIVE';
}

function toGroup(account: DirectoryAccount | null, visits: DirectoryVisit[], now: Date): PatientGroup {
  const latest = visits.at(-1);
  const lastVisit = visits.filter((visit) => isPastVisit(visit, now)).at(-1)?.startsAt ?? null;
  const nextVisit = visits.find((visit) => isUpcoming(visit, now))?.startsAt ?? null;
  const starts = [account?.createdAt, visits[0]?.startsAt].filter((value): value is Date => value instanceof Date);
  const since = starts.length > 0 ? new Date(Math.min(...starts.map((value) => value.getTime()))) : null;
  const entry = {
    id: account?.id ?? latest?.id ?? '',
    name: account?.name ?? latest?.patientName ?? '',
    email: account?.email ?? latest?.patientEmail ?? null,
    phone: account?.phone ?? latest?.patientPhone ?? '',
    hasAccount: account !== null,
    lastVisit,
    nextVisit,
    status: patientStatus({ since, lastVisit, nextVisit }, now),
  };
  return { entry, visits };
}

export function buildDirectory(accounts: DirectoryAccount[], visits: DirectoryVisit[], now: Date): PatientGroup[] {
  const groups = new Map<string, { account: DirectoryAccount | null; visits: DirectoryVisit[] }>();
  for (const account of accounts) groups.set(groupKey(account.email, account.phone), { account, visits: [] });
  for (const visit of [...visits].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())) {
    const key = groupKey(visit.patientEmail, visit.patientPhone);
    const group = groups.get(key) ?? { account: null, visits: [] };
    group.visits.push(visit);
    groups.set(key, group);
  }
  return [...groups.values()].map(({ account, visits: list }) => toGroup(account, list, now)).sort((a, b) => a.entry.name.localeCompare(b.entry.name, 'es'));
}
