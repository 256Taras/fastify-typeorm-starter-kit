import { promises as fs } from "node:fs";
import path from "node:path";

import { env } from "../../configs/env.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const seedsDirectory = path.join(__dirname, "..", "database", "seeds", env.NODE_ENV);

if (!(await fs.stat(seedsDirectory).catch(() => null))) {
  await fs.mkdir(seedsDirectory);
}

const seedName = process.argv[2];
if (!seedName) {
  // eslint-disable-next-line no-console
  console.error("Error: seed name not provided");
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const timestamp = new Date().getTime();
const seedFileName = `${timestamp}-${seedName}.js`;
const seedFilePath = path.join(seedsDirectory, seedFileName);

const seedFileContent = `
/**
 *
 * @param {import('typeorm').DataSource} dataSource
 * @returns {Promise<void>}
 */
 export default async function seed${seedName.charAt(0).toUpperCase() + seedName.slice(1)}(dataSource) {
  // write your seed code here
   /**
   * @example
   *   const user = new User();
   *   user.username = "johndoe";
   *   user.email = "johndoe@example.com";
   *   user.password = "password123";
   *   await appDataSource.getRepository(User).save(user);
   */
}`;

await fs.writeFile(seedFilePath, seedFileContent);

// eslint-disable-next-line no-console
console.debug(`Seed file created: ${seedFilePath}`);
