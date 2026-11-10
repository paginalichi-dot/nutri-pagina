import type { AppointmentDetail } from '@/features/agenda/domain/appointment.schema';

export function anAppointment(overrides: Partial<AppointmentDetail> = {}): AppointmentDetail {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    locationId: '22222222-2222-4222-8222-222222222222',
    locationName: 'Consultorio Centro',
    startsAt: new Date('2026-11-10T13:30:00Z'),
    endsAt: new Date('2026-11-10T14:15:00Z'),
    status: 'CONFIRMED',
    source: 'PANEL',
    patientName: 'Paciente Ficticio',
    patientPhone: '+5491100000000',
    patientEmail: 'paciente@example.com',
    healthInsuranceName: null,
    version: 1,
    place: { kind: 'IN_PERSON', address: 'Calle Falsa 123', directions: null, videoUrl: null },
    ...overrides,
  };
}
