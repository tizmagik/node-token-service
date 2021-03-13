/**
 * Mimic real storage by wrapping the in-memory DB in async calls
 */

// poor man's DB
const MEMORY_DB: { [token: string]: string } = {}; // token: key

export async function dbSave(entry: string, value: string): Promise<string> {
  MEMORY_DB[entry] = value;
  return Promise.resolve(entry);
}

export async function dbGet(entry: string): Promise<string> {
  const value = MEMORY_DB[entry];
  if (value) {
    return Promise.resolve(value);
  } else {
    return Promise.reject(new Error(`No record found for ${entry}`));
  }
}

export async function dbDelete(entry: string): Promise<boolean> {
  delete MEMORY_DB[entry];
  return Promise.resolve(true);
}
