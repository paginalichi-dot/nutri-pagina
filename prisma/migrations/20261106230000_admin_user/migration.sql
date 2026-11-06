-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "admin_user" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "session_version" INTEGER NOT NULL DEFAULT 1,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "admin_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_email_key" ON "admin_user"("email");


-- Restricciones que Prisma no expresa en el schema
ALTER TABLE "admin_user" ADD CONSTRAINT "admin_user_email_lowercase" CHECK ("email" = lower("email"));
ALTER TABLE "admin_user" ADD CONSTRAINT "admin_user_failed_attempts_non_negative" CHECK ("failed_attempts" >= 0);
ALTER TABLE "admin_user" ADD CONSTRAINT "admin_user_session_version_positive" CHECK ("session_version" >= 1);
