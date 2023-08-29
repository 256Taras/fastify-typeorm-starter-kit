import { tables } from "#src/common/constants/db-tables";

export declare interface ISeedData {
  name: string;
  data: Record<string, any>[];
}

export declare interface ISeed {
  [key: string]: ISeedData;
}

/**
 *  utility for working with the database.
 */
export declare const seedTables: typeof tables;
/**
 * Re-seeds the database with the provided seeds.
 * @param seeds An object containing the table names and corresponding data to seed.
 */
declare function reSeed(seeds: ISeed): Promise<void>;
/**
 * Seeds a single table with the provided data.
 * @param tableName The name of the table to seed.
 * @param data The data to seed the table with.
 */
declare function seed({ name, data }: ISeedData): Promise<any>;
/**
 * Cleans all data from the database.
 * Throws an error if attempted outside of a test environment.
 */
declare function cleanUp(): Promise<void>;

export declare const dbUtils: {
  cleanUp: typeof cleanUp;
  seed: typeof seed;
  reSeed: typeof reSeed;
};
