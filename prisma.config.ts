import * as dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';
import { envFileFor, resolveMigrationUrl } from './src/lib/db/database-config';

dotenv.config({ path: envFileFor(process.env), quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    get url(): string {
      return resolveMigrationUrl(process.env);
    },
  },
});
