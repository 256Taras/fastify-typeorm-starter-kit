import { env } from "../../configs/env.js";

export const SERVER_CONFIG = {
  port: env.HTTP_PORT ?? 3000,
  ip: env.IP ?? "localhost",
  shutdownTimeout: env.SHUTDOWN_TIMEOUT ?? 5000, // in ms
  requestTimeout: env.REQUEST_TIMEOUT ?? 6000,
};
