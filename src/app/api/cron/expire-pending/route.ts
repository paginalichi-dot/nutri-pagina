import { expireRequests } from '@/features/agenda/actions/expire-requests';

export async function GET(request: Request): Promise<Response> {
  const result = await expireRequests(request.headers.get('authorization'));
  if (!result) return Response.json({ error: 'No autorizado.' }, { status: 401 });
  return Response.json(result);
}
