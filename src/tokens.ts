import { decrypt, encrypt, generateKey } from "./encrypt";

// poor man's DB
const MEMORY_DB: { [token: string]: string } = {}; // token: key

/**
 * Gets a secret from memory
 *
 * @param token The token to retrieve a secret
 * @returns the secret as a string, or false if not found
 */
export function getSecret(token: string): string | false {
  let secret: string = "";

  try {
    const key = MEMORY_DB[token];
    secret = decrypt(token, key);
  } catch (e) {
    console.error(e); // TODO: In practice maybe keep a metrics count on these
  }

  return secret || false;
}

/**
 * Stores a secret in memory
 *
 * @param secret The secret to store
 * @returns {token} The token to be used later for retrieval
 */
export function setSecret(secret: string): string {
  const key = generateKey();
  const token = encrypt(secret, key);

  MEMORY_DB[token] = key;

  return token;
}

/**
 * Deletes a secret from memory
 * (fails silently, e.g. does not check for secrets existence first)
 * @param token The token for the secret to be deleted
 */
export function deleteSecret(token: string) {
  delete MEMORY_DB[token];
}
