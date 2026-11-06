const PG = { name: 'pg', message: 'Sólo src/lib/db/index.ts abre conexiones a la base.' };
const ADAPTER = { name: '@prisma/adapter-pg', message: 'Sólo src/lib/db/index.ts arma el cliente de Prisma.' };
const RAW_SQL = {
  selector: 'MemberExpression[property.name=/^\\$(query|execute)Raw(Unsafe)?$/]',
  message: 'Prohibido SQL plano: usá la API de Prisma Client. El SQL a mano va sólo en las migraciones.',
};

const forbid = (group, message) => ({ group, message });

const DB = forbid(['@/lib/db', '@/lib/db/*'], 'Sólo el repositorio toca la base (capas: ui → actions → services → repository → db).');
const DB_EXCEPT_TRANSACTION = forbid(['@/lib/db', '@/lib/db/*', '!@/lib/db/transaction'], 'El service sólo usa el helper de transacción de @/lib/db.');
const PRISMA_TYPES = forbid(['@/generated/prisma', '@/generated/prisma/**'], 'Los tipos de Prisma no salen del repositorio: usá los de domain.');
const REPOSITORY = forbid(['**/repository', '**/repository/*'], 'Esta capa no importa repositorios.');
const SERVICES = forbid(['**/services', '**/services/*'], 'Esta capa no importa services.');
const ACTIONS = forbid(['**/actions', '**/actions/*'], 'Esta capa no importa actions.');
const UI = forbid(['**/ui', '**/ui/**'], 'Esta capa no importa UI.');
const STORE = forbid(['**/store', '**/store/*'], 'Esta capa no importa stores.');
const NEXT = forbid(['next', 'next/*'], 'Esta capa no depende de Next.');
const FEATURES = forbid(['@/features', '@/features/**'], 'Esta capa no importa features.');

function restrict(patterns) {
  return {
    'no-restricted-imports': ['error', { paths: [PG, ADAPTER], patterns }],
    'no-restricted-syntax': ['error', RAW_SQL],
  };
}

const NOT_LAYERED = ['src/lib/db/**', 'src/test/**', 'src/**/testing/**', 'src/**/*.test.ts', 'src/**/*.test-d.ts', 'src/generated/**'];

export const layerConfigs = [
  { files: ['src/**/*.{ts,tsx}'], rules: restrict([PRISMA_TYPES]) },
  { files: ['src/app/**/*.{ts,tsx}', 'src/features/*/ui/**/*.{ts,tsx}'], rules: restrict([DB, PRISMA_TYPES, REPOSITORY, SERVICES]) },
  { files: ['src/features/*/store/**/*.ts'], rules: restrict([DB, PRISMA_TYPES, REPOSITORY, ACTIONS]) },
  { files: ['src/features/*/actions/**/*.ts'], rules: restrict([DB, PRISMA_TYPES, REPOSITORY, UI, STORE]) },
  { files: ['src/features/*/services/**/*.ts'], rules: restrict([DB_EXCEPT_TRANSACTION, PRISMA_TYPES, ACTIONS, UI, STORE, NEXT]) },
  { files: ['src/features/*/repository/**/*.ts'], rules: restrict([SERVICES, ACTIONS, UI, STORE, NEXT]) },
  { files: ['src/features/*/domain/**/*.ts'], rules: restrict([DB, PRISMA_TYPES, REPOSITORY, SERVICES, ACTIONS, NEXT]) },
  { files: ['src/components/**/*.{ts,tsx}', 'src/lib/**/*.ts'], rules: restrict([PRISMA_TYPES, FEATURES]) },
  { files: NOT_LAYERED, rules: { 'no-restricted-imports': 'off', 'no-restricted-syntax': 'off' } },
];
