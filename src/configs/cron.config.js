import { env } from "../../configs/env.js";

export const cronConfig = {
  autorun: env.ENABLE_CRON,
};
