import { seedTestAgenda } from '@/features/agenda/testing/seed-test-agenda';
import { adminRepository } from '@/features/auth/repository/admin.repository';
import { seedTestAdmin } from '@/features/auth/testing/seed-test-admin';
import { seedTestPatient } from '@/features/patient/testing/seed-test-patient';
import { db } from '@/lib/db';

async function seed(): Promise<void> {
  const email = await seedTestAdmin(adminRepository, process.env.APP_ENV);
  await seedTestAgenda(process.env.APP_ENV);
  await seedTestPatient(process.env.APP_ENV);
  console.info(`Cuenta admin de prueba lista: ${email}. Agenda y paciente de ejemplo cargados.`);
}

seed().finally(() => db.$disconnect());
