import { adminRepository } from '@/features/auth/repository/admin.repository';
import { createAdmin } from '@/features/auth/services/create-admin';
import { db } from '@/lib/db';

createAdmin(adminRepository, process.env)
  .then((email) => console.info(`Cuenta admin lista: ${email}.`))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'No se pudo crear el admin.');
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
