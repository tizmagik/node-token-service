import { encrypt, decrypt, generateKey } from "./encrypt";

// console.log(encrypt("secret", "blahblah"));

// Example usage
// generate 256-bit symmetric key
const key = generateKey();
const plaintext = "encrypt me!";
const ciphertext = encrypt(plaintext, key);

console.log(ciphertext);
console.log("hello");
console.log(decrypt(ciphertext, key));
