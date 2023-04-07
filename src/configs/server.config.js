import { env } from "../../configs/env.js";

export const serverConfig = {
  port: env.HTTP_PORT || 3000,
  ip: env.IP || "localhost",
  shutdownTimeout: env.SHUTDOWN_TIMEOUT || 5000, // in ms
  keepAliveTimeout: 5000, // for requests, in ms
};
