# [Nombre] · Nutrición

Web profesional y sistema de turnos de [Nombre], Licenciado en Nutrición.

- Reglas para agentes y humanos: [`AGENTS.md`](AGENTS.md)
- Identidad visual: [`DESIGN.md`](DESIGN.md)
- Backlog: [`BACKLOG.md`](BACKLOG.md)
- Contexto completo: [`docs/initial_prompt.md`](docs/initial_prompt.md)

## Requisitos

Node 22, npm y Docker.

## Primer arranque

```bash
npm install                              # instala dependencias, genera Prisma y los hooks de lefthook
cp .env.example .env.local               # y completá LOCAL_DATABASE_URL si cambiaste el puerto
docker compose up -d                     # base de desarrollo en 127.0.0.1:5435
npm run db:migrate                       # aplica las migraciones
npm run dev                              # http://localhost:3000
```

## Tests

```bash
npm run test:watch                       # mientras desarrollás
docker compose up -d --wait db-test      # base de tests en 127.0.0.1:5436
npm run test:int
npx playwright install chromium          # una sola vez
npm run test:e2e
npm run verify                           # todo, antes de integrar un ítem de nivel 3
```

Estrategia completa en [`docs/testing.md`](docs/testing.md).
