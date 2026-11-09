import { connection } from 'next/server';
import type { ReactElement } from 'react';
import { hasAdminSession } from '@/features/auth/actions/require-admin';
import { currentPatient } from '../../actions/require-patient';
import { AccountMenu } from './account-menu';
import { firstName } from './first-name';

export async function AccountStatus(): Promise<ReactElement> {
  await connection();
  const patient = await currentPatient();
  if (patient) return <AccountMenu viewer={{ role: 'patient', name: firstName(patient.name) }} />;
  return <AccountMenu viewer={(await hasAdminSession()) ? { role: 'admin' } : null} />;
}
