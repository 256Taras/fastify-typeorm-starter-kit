import { fastifyJwtConfig } from "#configs";

/** @typedef {import('../users/types.d').IUser} IUser */
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
   * @param {IUser} user
   * @param {{ id: string, ppid: string }} param1
   * @param {Object} param1 - The options object.
   * @param {string} param1.id - The ID of the refresh token.
   * @param {string} param1.ppid - The PPID of the user.
   * @returns {{ token:string, refreshToken:string }} An object containing the access token and the refresh token.
   * */
  generateTokens(user, { id: refreshTokenId, ppid }) {
    const token = this.generateAccessToken(user.id, refreshTokenId);
    const refreshToken = this.generateRefreshToken({
      id: user.id,
      refreshTokenId,
      ppid,
    });

    return { token, refreshToken };
  }

  /**
   * Generates an access token for the given user ID and refresh token ID.
   * @param {string} id - The user ID.
   * @param {string} refreshTokenId - The ID of the refresh token.
   * @returns {string} The access token.
   */
  generateAccessToken(id, refreshTokenId) {
    return this.#jwtService.accessToken.sign(
      { id, refreshTokenId },
      { expiresIn: fastifyJwtConfig.refreshTokenExpirationTime },
    );
  }

  /**
   * Generates a refresh token for the given user.
   * @param {Object} param0 - The options object.
   * @param {string} param0.id - The user ID.
   * @param {string} param0.refreshTokenId - The ID of the refresh token.
   * @param {string} param0.ppid - The PPID of the user.
   * @returns {string} The refresh token.
   */
  generateRefreshToken({ id, refreshTokenId, ppid }) {
    return this.#jwtService.refreshToken.sign(
      {
        id,
        ppid,
        refreshTokenId,
      },
      { expiresIn: fastifyJwtConfig.refreshTokenExpirationTime },
    );
  }

  /**
   * Generates and creates an authentication refresh token for the given user.
   * @param {Object} user - The user object.
   * @param {string} user.id - The user ID.
   * @returns {Promise<Object>} A Promise that resolves to the created AuthToken object.
   */
  async generateAndCreateOneAuthRefreshToken(user) {
    const refreshHash = this.#encrypterService.randomBytes(16);

    return this.#authTokensRepository.create({
      id: this.#encrypterService.uuid(),
      userId: user.id,
      ppid: refreshHash,
    });
  }

  /**
   * Generate access and refresh tokens for a user.
   * @param {IUser} user - The user for whom the tokens are generated.
   * @returns {Promise<{ refreshToken: string, accessToken: string, user: IUser }>} An object containing the refresh token, access token, and user object.
   */
  async getTokens(user) {
    const { id, ppid } = await this.generateAndCreateOneAuthRefreshToken(user);

    const { token, refreshToken } = this.generateTokens(user, { id, ppid });

    return {
      refreshToken,
      accessToken: token,
      user,
    };
  }
}
