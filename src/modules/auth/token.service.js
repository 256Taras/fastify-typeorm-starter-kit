/** @typedef {import('../users/types.js').IUser} IUser */
import { fastifyJwtConfig } from "#src/configs/index.js";

/** @typedef {import('@fastify/awilix').Cradle} Deps */

export default class TokenService {
  /**
   *  @type {{ accessToken: import('@fastify/jwt').JWT, refreshToken: import('@fastify/jwt').JWT }} */
  #jwtService;

  /** @type {Deps['encrypterService']} */
  #encrypterService;

  /** @type {Deps['authTokensRepository']} */
  #authTokensRepository;

  /**  @param deps {Deps} */
  constructor({ app, encrypterService, authTokensRepository }) {
    // @ts-ignore
    this.#jwtService = app.jwt;
    this.#encrypterService = encrypterService;
    this.#authTokensRepository = authTokensRepository;
  }

  /**
   * Generates access and refresh tokens for a user.
   * @param {IUser} user - The user for whom the tokens are generated.
   * @returns {Promise<{ refreshToken: string, accessToken: string, user: IUser }>} An object containing the refresh token, access token, and user object.
   */
  async generateTokens(user) {
    const refreshHash = this.#encrypterService.randomBytes(32);

    const refreshTokenId = this.#encrypterService.uuid();

    const accessToken = this.#jwtService.accessToken.sign(
      { id: user.id, refreshTokenId },
      { expiresIn: fastifyJwtConfig.refreshTokenExpirationTime },
    );

    const refreshToken = this.#jwtService.refreshToken.sign(
      { id: user.id, ppid: refreshHash, refreshTokenId },
      { expiresIn: fastifyJwtConfig.refreshTokenExpirationTime },
    );

    await this.#authTokensRepository
      .createQueryBuilder()
      .insert()
      .values({ id: refreshTokenId, userId: user.id, ppid: refreshHash })
      .execute();

    return { refreshToken, accessToken, user };
  }
}
