import { adminRepository } from '@/features/auth/repository/admin.repository';
import { seedTestAdmin } from '@/features/auth/testing/seed-test-admin';
import { db } from '@/lib/db';

seedTestAdmin(adminRepository, process.env.APP_ENV)
  .then((email) => console.info(`Cuenta admin de prueba lista: ${email}`))
  .finally(() => db.$disconnect());
