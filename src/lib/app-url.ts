export function appUrlFromEnv(env: Readonly<Record<string, string | undefined>>): string {
  const url = env.APP_URL?.replace(/\/+$/, '') ?? '';
  if (url !== '') return url;
  if (env.APP_ENV === 'production') throw new Error('APP_URL falta: los links de los emails no tendrían a dónde llevar.');
  return 'http://localhost:3000';
}
