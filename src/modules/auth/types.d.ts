import { Repository } from "typeorm";

import type TokenService from "#modules/auth/token.service";
import type AuthToken from "#modules/auth/auth-token.entity";

declare module "@fastify/awilix" {
  interface Cradle {
    tokenService: TokenService;
    authTokensRepository: Repository<AuthToken>;
  }
}

export interface IRefreshTokenUserPayload {
  "id": string;
  "ppid": string;
  "refreshTokenId": string;
  "iat": number;
  "exp": number;
}
