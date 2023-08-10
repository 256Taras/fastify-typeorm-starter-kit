import { logger } from "#services/logger/logger.service.js";
import { tables } from "#constants";

import DataSource from "../../infra/database/typeorm.config.js";
import { env } from "../../configs/env.js";

/**
 *  utility for working with the database.
 */
export const seedTables = tables;

/**
 * Re-seeds the database with the provided seeds.
 * @param seeds An object containing the table names and corresponding data to seed.
 */
async function reSeed(seeds) {
  await cleanUp();
  // eslint-disable-next-line no-restricted-syntax
  for await (const seedData of Object.values(seeds)) {
    // @ts-ignore
    await seed(seedData);
  }
}

/**
 * Seeds a single table with the provided data.
 * @param name The name of the table to seed.
 * @param data The data to seed the table with.
 */
async function seed({ name, data }) {
  const repo = DataSource.getRepository(name);

  return repo
    .clear()
    .then(() => repo.insert(data))
    .then(() => logger.info(`Seed from ${name} end successful`))
    .catch((error) => {
      logger.fatal(error, `An error occurred while installing SEEDS!`);
    });
}

/**
 * Cleans all data from the database.
 * Throws an error if attempted outside of a test environment.
 */
async function cleanUp() {
  logger.info("Cleaning database data...");
  const isSeedingAllowed =
    env.ENABLE_SEEDS === 1 &&
    // it's hardcoded double-step verification to prevent accidental migration running on production DB
    ["test"].includes(env.ENV_NAME);
  if (isSeedingAllowed) {
    await DataSource.createQueryRunner()
      .query(
        `TRUNCATE  ${Object.values(tables)
          .map((t) => `"${t}" `)
          .join()};`,
      )
      .catch(logger.error);
    logger.info("Cleaning seeds finished successfully.");
    return;
  }
  throw Error("It's forbidden to clean non-test DB!");
}

export const dbUtils = {
  cleanUp,
  seed,
  reSeed,
};
