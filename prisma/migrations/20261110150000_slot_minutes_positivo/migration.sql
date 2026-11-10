-- Por qué: el dev pidió que la duración acepte cualquier entero de minutos mayor que 0 (US-44).
ALTER TABLE "agenda_settings" DROP CONSTRAINT "agenda_settings_slot_minutes_range";
ALTER TABLE "agenda_settings" ADD CONSTRAINT "agenda_settings_slot_minutes_range" CHECK ("slot_minutes" > 0);
