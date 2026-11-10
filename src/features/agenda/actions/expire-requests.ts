import 'server-only';
import { sendLater } from '@/features/patient/actions/send-later';
import { isCronAuthorized } from '@/lib/auth/cron-secret';
import { bookingService } from '../services/booking.service';

export async function expireRequests(authorization: string | null): Promise<{ notified: number } | null> {
  if (!isCronAuthorized(authorization, process.env.CRON_SECRET)) return null;
  const emails = await bookingService().expire();
  emails.forEach(sendLater);
  return { notified: emails.length };
}
