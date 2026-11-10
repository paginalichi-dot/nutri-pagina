import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUTBOX = '.e2e-outbox';

type Sent = { to: string; subject: string; text: string };

async function sentTo(email: string): Promise<Sent[]> {
  const files = (await readdir(OUTBOX).catch(() => [])).toSorted().toReversed();
  const messages = await Promise.all(files.map(async (file): Promise<Sent> => JSON.parse(await readFile(join(OUTBOX, file), 'utf8'))));
  return messages.filter(({ to }) => to === email);
}

export const emailsSentTo = async (email: string): Promise<number> => (await sentTo(email)).length;

export async function linkSentTo(email: string, path: string): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    for (const { text } of await sentTo(email)) {
      const match = new RegExp(String.raw`https?://\S+${path}/[\w-]{43}`).exec(text);
      if (match) return match[0];
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`No llegó a la outbox un link ${path} para ${email}.`);
}
