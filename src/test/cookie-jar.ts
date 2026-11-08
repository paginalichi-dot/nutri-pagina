type Cookie = { name: string; value: string };
type CookieOptions = Readonly<Record<string, unknown>>;

const store = new Map<string, string>();
const options = new Map<string, CookieOptions | undefined>();

export const cookieJar = {
  get(name: string): Cookie | undefined {
    const value = store.get(name);
    return value === undefined ? undefined : { name, value };
  },
  set(name: string, value: string, cookieOptions?: CookieOptions): void {
    store.set(name, value);
    options.set(name, cookieOptions);
  },
  delete(name: string): void {
    store.delete(name);
    options.delete(name);
  },
  optionsOf(name: string): CookieOptions | undefined {
    return options.get(name);
  },
  clear(): void {
    store.clear();
    options.clear();
  },
};
