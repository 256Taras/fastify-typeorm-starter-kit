// import cron from "node-cron";

import { cronConfig } from "#configs";
import { logger } from "#services/logger/logger.service.js";

// for generate time use https://crontab.guru
export default async function schedulesPlugin() {
  if (!cronConfig.autorun) logger.info("Cron disabled");
  else logger.info("Cron enabled");
}
