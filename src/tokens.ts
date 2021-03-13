import { decrypt, encrypt, generateKey } from "./encrypt";
import { dbDelete, dbGet, dbSave } from "./storage";

const TOKEN_PREFIX = "dp.token.";

/**
 * Gets a secret from memory
 *
 * @param token The token to retrieve a secret
 * @returns the secret as a string, or false if not found
 */
export async function getSecret(token: string): Promise<string> {
  let secret: string = "";

  // Should we *only* accept tokens with the proper token prefix?
  const rawToken = token.startsWith(TOKEN_PREFIX)
    ? token.slice(TOKEN_PREFIX.length)
    : token;

  try {
    const key = await dbGet(token);
    secret = decrypt(rawToken, key);
  } catch (e) {
    // swallow errors
    console.error(e); // TODO: In practice maybe keep a metrics count on these
  }

  return secret;
}

/**
 * Stores a secret in memory
 *
 * @param secret The secret to store
 * @returns {token} The token to be used later for retrieval
 */
export async function setSecret(secret: string): Promise<string> {
  const key = generateKey();
  const token = TOKEN_PREFIX + encrypt(secret, key);

  return dbSave(token, key);
}

/**
 * Deletes a secret from memory
 * (fails silently, e.g. does not check for secrets existence first)
 * @param token The token for the secret to be deleted
 */
export function deleteSecret(token: string) {
  return dbDelete(token);
}
