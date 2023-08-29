import { TEncryptionAlgorithm } from "./encryption-algorithm.type";
import { IUuidOptions } from "./uuid-options.interface.d";

/**
 * Interface for encrypting and hashing data.
 */
export interface IEncrypterInterface {
  /**
   * Compares a string with a given hash and returns a boolean indicating whether they match.
   * @param data - The plain text to compare.
   * @param hash - The hash to compare against.
   * @returns A promise that resolves to a boolean indicating whether the plain text and hash match.
   */
  compareHash(data: string, hash: string): Promise<boolean>;

  /**
   * Encodes a string using base64 encoding.
   * @param data - The plain text to encode.
   * @returns The encoded string.
   */
  base64Encode(data: string): string;

  /**
   * Decodes a string that was encoded using base64 encoding.
   * @param data - The encoded string to decode.
   * @param urlFriendly - Optional. If true, replaces characters that are not URL-friendly with characters that are.
   * @returns The decoded string.
   */
  base64Decode(data: string, urlFriendly?: boolean): string;

  /**
   * Decrypts an encrypted string using a specified encryption algorithm.
   * @param encryptedData - The string to decrypt.
   * @param algorithm - Optional. The encryption algorithm to use. Defaults to "aes-256-cbc".
   * @returns The decrypted string.
   */
  decrypt(encryptedData: string, algorithm?: TEncryptionAlgorithm): string;

  /**
   * Encrypts a string using a specified encryption algorithm.
   * @param rawData - The plain text to encrypt.
   * @param algorithm - Optional. The encryption algorithm to use. Defaults to "aes-256-cbc".
   * @returns The encrypted string.
   */
  encrypt(rawData: string, algorithm?: TEncryptionAlgorithm): string;

  /**
   * Hashes a string using a specified number of salt rounds.
   * @param data - The plain text to hash.
   * @param saltRounds - Optional. The number of salt rounds to use. Defaults to 10.
   * @returns A promise that resolves to the hashed string.
   */
  getHash(data: string, saltRounds?: number): Promise<string>;

  /**
   * Generates cryptographically random bytes and returns them as a string.
   * @param length - Optional. The number of bytes to generate. Defaults to 16.
   * @param encoding - Optional. The encoding to use for the output string. Defaults to "hex".
   * @returns A string containing the random bytes.
   */
  // eslint-disable-next-line no-undef
  randomBytes(length?: number, encoding?: BufferEncoding): string;

  /**
   * Generates a UUID (Universally Unique IDentifier) string.
   * @param options - Optional. An object containing options for the UUID generation.
   * @returns A string containing the generated UUID.
   */
  uuid(options?: IUuidOptions): string;
}
