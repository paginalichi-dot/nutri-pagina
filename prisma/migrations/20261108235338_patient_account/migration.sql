-- CreateEnum
CREATE TYPE "PatientTokenPurpose" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD', 'CHANGE_EMAIL');

-- CreateTable
CREATE TABLE "patient" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMPTZ,
    "consent_at" TIMESTAMPTZ NOT NULL,
    "session_version" INTEGER NOT NULL DEFAULT 1,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_token" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "purpose" "PatientTokenPurpose" NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "new_email" VARCHAR(254),
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit" (
    "key" VARCHAR(200) NOT NULL,
    "count" INTEGER NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "rate_limit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patient_token_token_hash_key" ON "patient_token"("token_hash");

-- CreateIndex
CREATE INDEX "patient_token_patient_id_purpose_idx" ON "patient_token"("patient_id", "purpose");

-- CreateIndex
CREATE INDEX "rate_limit_expires_at_idx" ON "rate_limit"("expires_at");

-- AddForeignKey
ALTER TABLE "patient_token" ADD CONSTRAINT "patient_token_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Restricciones que Prisma no expresa en el schema
ALTER TABLE "patient" ADD CONSTRAINT "patient_email_lowercase" CHECK ("email" = lower("email"));
ALTER TABLE "patient" ADD CONSTRAINT "patient_name_not_blank" CHECK (btrim("name") <> '');
ALTER TABLE "patient" ADD CONSTRAINT "patient_failed_attempts_non_negative" CHECK ("failed_attempts" >= 0);
ALTER TABLE "patient" ADD CONSTRAINT "patient_session_version_positive" CHECK ("session_version" >= 1);

ALTER TABLE "patient_token" ADD CONSTRAINT "patient_token_new_email_lowercase" CHECK ("new_email" = lower("new_email"));
ALTER TABLE "patient_token" ADD CONSTRAINT "patient_token_new_email_only_for_change" CHECK (("purpose" = 'CHANGE_EMAIL') = ("new_email" IS NOT NULL));
ALTER TABLE "patient_token" ADD CONSTRAINT "patient_token_expires_after_creation" CHECK ("expires_at" > "created_at");
CREATE UNIQUE INDEX "patient_token_one_active" ON "patient_token" ("patient_id", "purpose") WHERE "used_at" IS NULL;

ALTER TABLE "rate_limit" ADD CONSTRAINT "rate_limit_count_positive" CHECK ("count" > 0);
