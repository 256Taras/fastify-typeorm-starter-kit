// Importing required modules
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";

import { env } from "../../configs/env.js";
import { DatabaseLoggerService } from "#services/logger/database-logger.service.js";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to recursively find all files in a given directory
// If isEntity flag is set to true, only return files with .entity.js extension
async function findFiles(dir, isEntity = false) {
  // Read all files in the given directory
  const files = await fs.readdir(dir, { withFileTypes: true });
  const result = [];

  // Loop through each file and folder in the directory
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // Get the full path of the file or folder
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      // If the current item is a directory, recursively call the function to find files inside it
      // eslint-disable-next-line no-await-in-loop
      result.push(...(await findFiles(fullPath, true)));
    } else if (`${file.name}`.endsWith(isEntity ? ".entity.js" : ".js")) {
      // If the current item is a file with the correct extension, add it to the result array
      result.push(fullPath);
    }
  }

  // Return the final array of file paths
  return result;
}

// Find all entity files in the modules directory
const entityFiles = await findFiles(path.join(__dirname, "..", "..", "src", "modules"), true);

// Find all migration files in the current directory
const migrationsFiles = await findFiles(path.join(__dirname, "migrations"));

// Load all entity schemas into an array
const entities = await Promise.all(
  entityFiles.map(async (file) => {
    // Dynamically import the file and get the default export (assumed to be the entity class)
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { default: Entity } = await import(`file://${file}`);
    // Return the entity schema
    return Entity.schema;
  }),
);

// Load all migrations into an array
const migrations = await Promise.all(
  migrationsFiles.map(async (file) => {
    // Dynamically import the file and get the default export (assumed to be the migration class)
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { default: Migration } = await import(`file://${file}`);
    // Return the migration class
    return Migration;
  }),
);

const ssl = {
  ...(env.TYPEORM_SSL && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
};

/**
 * TypeORM database connection configuration
 * @type {import('typeorm/driver/postgres/PostgresConnectionOptions').PostgresConnectionOptions}
 */
export const ormConfig = {
  name: env.TYPEORM_NAME,
  type: env.TYPEORM_TYPE,
  host: env.TYPEORM_HOST,
  port: env.TYPEORM_PORT,
  database: env.TYPEORM_DATABASE,
  username: env.TYPEORM_USERNAME,
  password: env.TYPEORM_PASSWORD,
  cache: env.TYPEORM_CACHE,
  logging: env.TYPEORM_LOGGING,
  dropSchema: env.TYPEORM_DROP_SCHEMA,
  synchronize: env.TYPEORM_SYNCHRONIZE,
  migrationsRun: env.TYPEORM_MIGRATIONS_RUN,
  logger: new DatabaseLoggerService(),
  entities,
  migrations,
  ...ssl,
  cli: {
    migrationsDir: "src/database/migrations",
    entitiesDir: "src/**/*.js",
  },
};
export default new DataSource(ormConfig);
