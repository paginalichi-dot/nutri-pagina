import { execFileSync } from 'node:child_process';
import { Client } from 'pg';
import { assertTestDatabaseUrl } from './test-database-url';

const CONNECTION_HINT = 'No se pudo conectar a db-test. Levantala con: docker compose up -d --wait db-test';

// Por qué: Vite falla al mapear el stack de un error lanzado en el globalSetup y oculta el mensaje.
function readableError(message: string): Error {
  return Object.assign(new Error(message), { stack: `Error: ${message}` });
}

function guardedUrl(): string {
  try {
    const { LOCAL_DATABASE_URL, NODE_ENV, APP_ENV } = process.env;
    return assertTestDatabaseUrl({ url: LOCAL_DATABASE_URL, nodeEnv: NODE_ENV, appEnv: APP_ENV });
  } catch (error) {
    throw readableError(error instanceof Error ? error.message : String(error));
  }
}

async function connectOrExplain(url: string): Promise<void> {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
  } catch {
    throw readableError(CONNECTION_HINT);
  } finally {
    await client.end().catch(() => undefined);
  }
}

export default async function setup(): Promise<void> {
  await connectOrExplain(guardedUrl());
  execFileSync('npx', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit', shell: process.platform === 'win32' });
}
