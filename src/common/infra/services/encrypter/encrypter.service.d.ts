import { TEncryptionAlgorithm } from "#services/encrypter/encryption-algorithm.type";
import { IUuidOptions } from "#services/encrypter/uuid-options.interface.d.js";
import { IEncrypterInterface } from "#services/encrypter/encrypter.interface";

export declare class EncrypterService implements IEncrypterInterface {
  private key;

  compareHash(data: string, hash: string): Promise<boolean>;

  base64Encode(data: string): string;

  base64Decode(data: string, urlFriendly?: boolean): string;

  decrypt(encryptedData: string, algorithm?: TEncryptionAlgorithm): string;

  encrypt(rawData: string, algorithm?: TEncryptionAlgorithm): string;

  getHash(data: string, saltRounds?: number): Promise<string>;

  // eslint-disable-next-line no-undef
  randomBytes(length?: number, encoding?: BufferEncoding): string;

  uuid(options?: IUuidOptions): string;
}
