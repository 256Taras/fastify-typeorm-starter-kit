import { IUser } from "#src/modules/users/types";
import { IRefreshTokenUserPayload } from "#modules/auth/types";

/**
 *  Fastify wrapper on AsyncLocalStorage
 */
export declare const userContext: {
  get(): IUser;
  set(value: IUser): void;
};

/**
 *  Fastify wrapper on AsyncLocalStorage
 */
export declare const userRefreshTokenContext: {
  get(): IRefreshTokenUserPayload;
  set(value: Omit<IRefreshTokenUserPayload, "exp" | "iat">): void;
};

declare module "@fastify/awilix" {
  interface Cradle {
    userContext: typeof userContext;
    userRefreshTokenContext: typeof userRefreshTokenContext;
  }
}
