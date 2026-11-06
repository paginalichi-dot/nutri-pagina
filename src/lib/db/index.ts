import 'server-only';
import * as dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { envFileFor, resolveDatabaseConfig } from './database-config';

dotenv.config({ path: envFileFor(process.env) });

function createClient(): PrismaClient {
  const config = resolveDatabaseConfig(process.env);
  const adapter = new PrismaPg({
    connectionString: config.url,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
    max: config.maxConnections,
  });
  return new PrismaClient({ adapter, log: config.logQueries ? ['query'] : [] });
}

const cache: typeof globalThis & { prisma?: PrismaClient } = globalThis;

export const db = cache.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') cache.prisma = db;
