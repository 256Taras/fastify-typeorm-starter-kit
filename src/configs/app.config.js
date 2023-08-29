import { env } from "../../configs/env.js";

export const APP_CONFIG = {
  env: env.ENV_NAME,
  isDebug: env.ENABLE_DEBUG === 1,
  isSeedsEnabled: env.ENABLE_SEEDS === 1,
  isEnabledDbLogging: env.ENABLE_DB_LOGGING === 1,
  // isRollbackEnabled: env.ENABLE_DB_ROLLBACK === 1,
  isDeveloperMessageEnabled: env.ENABLE_DEVELOPER_MESSAGE === 1,
  isMigrationsEnabled:
    env.TYPEORM_MIGRATIONS_RUN &&
    // it's hardcoded double-step verification to prevent accidental migration running on production DB
    // @ts-ignore
    ["development", "dev", "develop", "local"].includes(env.ENV_NAME ?? ""),
  applicationName: env.APPLICATION_NAME,
  applicationUrl: env.APPLICATION_URL,
  version: env.VERSION ?? "latest",
  adminerUrl: "http://localhost:8888",
};
