import { appConfig } from "#src/configs/app.config.js";

export const authConfig = {
  /** Cookie options for refresh tokens */
  refreshTokenCookiesOption: {
    httpOnly: true,
    path: "/",
    // @ts-ignore
    /** @type {const} */
    sameSite: "lax",
    secure: appConfig.env === "production",
    // TODO to .env
    maxAge: 60 * 60 * 24 * 7,
  },
  /** Defines the keys used for cookies. */
  refreshTokenKey: "x-refresh-token",
};
