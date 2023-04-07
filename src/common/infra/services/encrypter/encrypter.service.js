import crypto, { createCipheriv, createDecipheriv, randomBytes, randomUUID } from "node:crypto";

/**
 * Provides methods for encryption and decryption, as well as hash comparison.
 */
export default class EncrypterService {
  /** The encryption key to use for encryption and decryption. */
  key = "";

  /** The number of salt rounds to use for generating the hash. */
  saltRounds = 10;

  /** The length of the derived key to use for generating the hash. */
  keyLength = 64;

  /**
   * Generates a hash of the given password with a random salt.
   * @param {string} password - The password to hash.
   * @param {number} [saltRounds] - The number of salt rounds to use (optional).
   * @returns {Promise<string>} A Promise that resolves to the salt and derived key, separated by a colon.
   */
  getHash(password, saltRounds) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(saltRounds || this.saltRounds).toString("hex");
      crypto.scrypt(password, salt, this.keyLength, (err, derivedKey) => {
        if (err) reject(err);
        resolve(`${salt}:${derivedKey.toString("hex")}`);
      });
    });
  }

  /**
   * Compares a plaintext value to a hash to determine if they match.
   * @param {string} data - The plaintext value to compare.
   * @param {string} hash - The hash to compare against.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the plaintext matches the hash.
   */
  compareHash(data, hash) {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(":");
      crypto.scrypt(data, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        //
        resolve(key === derivedKey.toString("hex"));
      });
    });
  }

  /**
   * Encodes a base64 string to ASCII.
   * @param {string} data - The base64 string to encode.
   * @returns {string} The encoded string.
   */
  base64Encode(data) {
    return Buffer.from(data, "base64").toString("ascii");
  }

  /**
   * Decodes a base64 string.
   * @param {string} data - The base64 string to decode.
   * @param {boolean} [urlFriendly=false] - Whether to replace characters to make the string URL-friendly (optional).
   * @returns {string} The decoded string.
   */
  base64Decode(data, urlFriendly = false) {
    const encoded = Buffer.from(data).toString("base64");
    return urlFriendly ? encoded.replaceAll(/\+\//g, "-").replaceAll("=", "") : encoded;
  }

  /**
   * Decrypts a string using the specified algorithm.
   * @param {string} encryptedData - The data to decrypt.
   * @param {string} [algorithm="aes-256-cbc"] - The encryption algorithm to use (optional).
   * @returns {string} The decrypted string.
   */
  decrypt(encryptedData, algorithm = "aes-256-cbc") {
    const decipher = createDecipheriv(algorithm, this.key, this.key.slice(0, Math.trunc(this.key.length / 2)));
    const decryptedData =
      algorithm === "aes-256-ctr"
        ? decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8")
        : Buffer.concat([decipher.update(Buffer.from(encryptedData, "hex")), decipher.final()]).toString();
    return decryptedData;
  }

  /**
   * Encrypts the given data using the specified encryption algorithm and returns the encrypted result.
   *
   * @param {string} rawData - The data to encrypt.
   * @param {string} [algorithm="aes-256-cbc"] - The encryption algorithm to use. Defaults to "aes-256-cbc".
   * @returns {string} The encrypted data.
   */
  encrypt(rawData, algorithm = "aes-256-cbc") {
    const cipher = createCipheriv(algorithm, this.key, this.key.slice(0, Math.trunc(this.key.length / 2)));
    const encryptedData =
      algorithm === "aes-256-ctr"
        ? cipher.update(rawData, "utf8", "hex") + cipher.final("hex")
        : Buffer.concat([cipher.update(rawData), cipher.final()]).toString("hex");
    return encryptedData;
  }

  /**
   * Generates cryptographically secure random bytes of the specified length and encoding and returns them as a string.
   *
   * @param {number} [length=16] - The length of the random bytes to generate. Defaults to 16.
   * @param {string} [encoding="hex"] - The encoding to use for the generated random bytes. Defaults to "hex".
   * @returns {string} The generated random bytes as a string.
   */
  randomBytes(length = 16, encoding = "hex") {
    // @ts-ignore
    return randomBytes(length).toString(encoding);
  }

  /**
   * Generates a UUID (Universally Unique Identifier) v4 and returns it as a string.
   *
   * @param {object} [options] - The options to use for generating the UUID.
   * @param {boolean} [options.clean=false] - Whether to remove hyphens from the generated UUID. Defaults to false.
   * @returns {string} The generated UUID as a string.
   */
  uuid(options) {
    const uuid = randomUUID();
    return options?.clean ? uuid.replaceAll("-", "") : uuid;
  }
}
