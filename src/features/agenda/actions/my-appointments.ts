import 'server-only';
import { guardPatientPage } from '@/features/patient/actions/require-patient';
import type { MyAppointments } from '../domain/appointment.schema';
import { agendaService } from '../services/agenda.service';

export async function getMyAppointments(): Promise<MyAppointments> {
  const { email } = await guardPatientPage();
  return agendaService.mine(email);
}
