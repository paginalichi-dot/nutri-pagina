-- CreateEnum
CREATE TYPE "LocationKind" AS ENUM ('IN_PERSON', 'ONLINE');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ATTENDED', 'NO_SHOW', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AppointmentSource" AS ENUM ('ONLINE', 'PANEL');

-- CreateTable
CREATE TABLE "location" (
    "id" UUID NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "kind" "LocationKind" NOT NULL,
    "address" VARCHAR(120),
    "directions" VARCHAR(200),
    "map_url" VARCHAR(1000),
    "video_url" VARCHAR(500),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_hours" (
    "id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_minute" INTEGER NOT NULL,
    "end_minute" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "slot_minutes" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "agenda_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_insurance" (
    "id" UUID NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "health_insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "starts_at" TIMESTAMPTZ NOT NULL,
    "ends_at" TIMESTAMPTZ NOT NULL,
    "status" "AppointmentStatus" NOT NULL,
    "source" "AppointmentSource" NOT NULL,
    "patient_name" VARCHAR(80) NOT NULL,
    "patient_phone" VARCHAR(20) NOT NULL,
    "patient_email" VARCHAR(254),
    "health_insurance_id" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_block" (
    "id" UUID NOT NULL,
    "starts_at" TIMESTAMPTZ NOT NULL,
    "ends_at" TIMESTAMPTZ NOT NULL,
    "reason" VARCHAR(100),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weekly_hours_location_id_idx" ON "weekly_hours"("location_id");

-- CreateIndex
CREATE INDEX "appointment_starts_at_idx" ON "appointment"("starts_at");

-- CreateIndex
CREATE INDEX "appointment_patient_email_idx" ON "appointment"("patient_email");

-- CreateIndex
CREATE INDEX "time_block_starts_at_idx" ON "time_block"("starts_at");

-- AddForeignKey
ALTER TABLE "weekly_hours" ADD CONSTRAINT "weekly_hours_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_health_insurance_id_fkey" FOREIGN KEY ("health_insurance_id") REFERENCES "health_insurance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Restricciones que Prisma no expresa en el schema
CREATE UNIQUE INDEX "location_name_key" ON "location" (lower("name"));
CREATE UNIQUE INDEX "location_single_online_key" ON "location" ("kind") WHERE "kind" = 'ONLINE';
ALTER TABLE "location" ADD CONSTRAINT "location_name_not_blank" CHECK (btrim("name") <> '');
ALTER TABLE "location" ADD CONSTRAINT "location_kind_fields" CHECK (
  ("kind" = 'IN_PERSON' AND "address" IS NOT NULL AND "video_url" IS NULL)
  OR ("kind" = 'ONLINE' AND "video_url" IS NOT NULL AND "address" IS NULL AND "directions" IS NULL AND "map_url" IS NULL)
);
ALTER TABLE "location" ADD CONSTRAINT "location_map_url_embed" CHECK ("map_url" IS NULL OR "map_url" LIKE 'https://www.google.com/maps/embed?%');
ALTER TABLE "location" ADD CONSTRAINT "location_video_url_https" CHECK ("video_url" IS NULL OR "video_url" LIKE 'https://%');

ALTER TABLE "weekly_hours" ADD CONSTRAINT "weekly_hours_weekday_range" CHECK ("weekday" BETWEEN 1 AND 7);
ALTER TABLE "weekly_hours" ADD CONSTRAINT "weekly_hours_minutes_range" CHECK ("start_minute" >= 0 AND "end_minute" <= 1440 AND "start_minute" < "end_minute");
-- Lisandro es una sola persona: dos franjas semanales nunca se pisan, en ninguna ubicación.
ALTER TABLE "weekly_hours" ADD CONSTRAINT "weekly_hours_no_overlap" EXCLUDE USING gist (
  (int4range(("weekday" - 1) * 1440 + "start_minute", ("weekday" - 1) * 1440 + "end_minute")) WITH &&
);

ALTER TABLE "agenda_settings" ADD CONSTRAINT "agenda_settings_single_row" CHECK ("id" = 1);
ALTER TABLE "agenda_settings" ADD CONSTRAINT "agenda_settings_slot_minutes_range" CHECK ("slot_minutes" BETWEEN 15 AND 120 AND "slot_minutes" % 5 = 0);

CREATE UNIQUE INDEX "health_insurance_name_key" ON "health_insurance" (lower("name"));
ALTER TABLE "health_insurance" ADD CONSTRAINT "health_insurance_name_valid" CHECK (btrim("name") <> '' AND lower(btrim("name")) <> 'particular');

ALTER TABLE "appointment" ADD CONSTRAINT "appointment_time_order" CHECK ("ends_at" > "starts_at");
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_email_lowercase" CHECK ("patient_email" = lower("patient_email"));
-- Lisandro es una sola persona: dos turnos activos nunca se pisan, en ninguna ubicación.
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_no_overlap" EXCLUDE USING gist (
  (tstzrange("starts_at", "ends_at")) WITH &&
) WHERE ("status" <> 'CANCELLED');

ALTER TABLE "time_block" ADD CONSTRAINT "time_block_time_order" CHECK ("ends_at" > "starts_at");
