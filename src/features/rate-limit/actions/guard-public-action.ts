import 'server-only';
import { requestIp } from '@/lib/request-ip';
import { type PublicAction, publicActionChecks, rateLimitService } from '../services/rate-limit.service';

export async function guardPublicAction(action: PublicAction, email?: string): Promise<void> {
  await rateLimitService.consume(publicActionChecks(action, { ip: await requestIp(), email }));
}
