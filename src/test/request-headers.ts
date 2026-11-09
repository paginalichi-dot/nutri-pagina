export const requestHeaders = new Headers();

export function clearRequestHeaders(): void {
  for (const name of [...requestHeaders.keys()]) requestHeaders.delete(name);
}
