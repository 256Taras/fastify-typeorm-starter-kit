import fs from "node:fs";
import util from "node:util";
import path from "node:path";
import { pipeline } from "node:stream";
import { randomUUID } from "node:crypto";

import { TEMP_STORAGE_PATH } from "#constants";

export const generateFileName = (name) => {
  const extension = path.extname(name).substring(1);

  return `${randomUUID()}.${extension}`;
};

/**
 * Creates an error object for a file that exceeds the specified size limit.
 * @returns {Error} Error object with the status code set to 413.
 */
const createPayloadTooLargeError = () => {
  const error = new Error("request file too large, please check multipart config");

  // @ts-ignore
  error.statusCode = 413;

  return error;
};

/**
 * Handles a multipart file stream and saves it to disk.
 * @param {Object} part - The multipart file stream.
 * @returns {Promise<void>}
 */
const onFile = async (part) => {
  const pump = util.promisify(pipeline);

  if (part.file.truncated) {
    throw createPayloadTooLargeError();
  }

  const filePath = `${TEMP_STORAGE_PATH}/${generateFileName(part.filename)}`;

  part.file.on("limit", () => {
    part.file.destroy(createPayloadTooLargeError());
  });

  part.file.on("error", async () => {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error(`Error deleting file ${filePath}: ${err.message}`);
    }
  });

  // eslint-disable-next-line no-param-reassign
  part.path = filePath;

  await pump(part.file, fs.createWriteStream(filePath));
};

/**
 * Configuration options for fastify-multipart.
 * @type {Object}
 * @property {boolean} attachFieldsToBody - If true, attaches fields to the request body. Default: true.
 * @property {Object} limits - Limits for incoming data.
 * @property {number} limits.fileSize - Maximum file size in bytes. Default: 104857600 (100 MB).
 * @property {function} onFile - Function to handle incoming files.
 */
export const fastifyMultipartConfig = {
  attachFieldsToBody: true,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  onFile,
};
