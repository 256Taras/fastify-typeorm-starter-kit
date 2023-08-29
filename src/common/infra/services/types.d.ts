import { IEncrypterInterface } from "#common/infra/services/encrypter/encrypter.interface";
import { ILogger } from "#common/infra/services/logger/logger.interface";
import { IHttpClient } from "#common/infra/services/http/http-client.interface";

declare module "@fastify/awilix" {
  interface Cradle {
    encrypterService: IEncrypterInterface;
    logger: ILogger;
    httpClientService: IHttpClient;
  }
}
