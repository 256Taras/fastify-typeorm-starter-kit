import { env } from "../../configs/env.js";

export const fastifyCookieConfig = {
  secret: env.COOKIE_SECRET,
};
