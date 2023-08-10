import fs from "node:fs";
import path from "node:path";

import dataSource from "../database/typeorm.config.js";
import { env } from "../../configs/env.js";

/**
 * Directory where seed files are located.
 * @constant
 * @type {string}
 */
const seedsDirectory = path.join(process.cwd(), `infra/database/seeds/${env.NODE_ENV}`);

/**
 * An array of file names in the seeds directory.
 * @constant
 * @type {string[]}
 */
// eslint-disable-next-line no-sync
const seedFiles = fs.readdirSync(seedsDirectory);

/**
 * Asynchronously loads seed files in chronological order and executes them against the database.
 * @async
 * @function
 * @returns {Promise<void>} - A Promise that resolves when all seed files have been executed.
 */
(async () => {
  let connection;

  try {
    connection = await dataSource.initialize();

    for (const seedFileName of seedFiles) {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const seedFile = await import(path.join(seedsDirectory, seedFileName)).then((module) => module.default);
      await seedFile(connection);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error seeding database: ${err.message}`);
  } finally {
    if (connection) {
      await connection.destroy();
    }
  }
})();
