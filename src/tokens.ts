import { decrypt, encrypt, generateKey } from "./encrypt";

// poor man's DB
const MEMORY_DB: { [token: string]: string } = {}; // token: key

export function getSecret(token: string) {
  const key = MEMORY_DB[token];
  return decrypt(token, key);
}

export function setSecret(secret: string) {
  const key = generateKey();
  const token = encrypt(secret, key);

  MEMORY_DB[token] = key;

  return token;
}

export function deleteSecret(token: string) {
  delete MEMORY_DB[token];
}
