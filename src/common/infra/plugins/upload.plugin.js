import fs from "node:fs/promises";

import fp from "fastify-plugin";

import { isMappable } from "#common/utils/objects/index.js";
import { validateSchema } from "#common/utils/schemas/index.js";
import { logger } from "#common/infra/services/logger/logger.service.js";
import { APP_CONFIG } from "#src/configs/index.js";
import { UNSUPPORTED_MEDIA_TYPE_415 } from "#common/errors/index.js";
import { STORAGE_CONFIG } from "#src/configs/storage.config.js";

/**
 * A Fastify plugin that creates a dependency injection container using Awilix.
 * @type {import('fastify').FastifyPluginAsync} app
 */
async function uploadPlugin(app, option) {
  // @ts-ignore
  app.decorate("parseMultipartFields", option?.parseMultipartFields ?? parseMultipartFields);
  // @ts-ignore
  app.decorate("removeUploadIfExists", option?.removeUploadIfExists ?? removeUploadIfExists);
  // @ts-ignore
  app.decorate("uploadToStorage", option?.uploadToStorage ?? uploadToStorage);
  // @ts-ignore
  app.decorate("upload", option?.upload ?? upload);

  /**
   * Removes an uploaded file from the server if it exists.
   *
   * @async
   * @function
   * @param {string} filePath - The path to the uploaded file.
   * @throws {Error} - If the file failed to be removed.
   */
  async function removeUploadIfExists(filePath) {
    const serverPath = toServerPath(filePath);
    try {
      await fs.access(serverPath); // check if file exists
      await fs.unlink(serverPath); // remove file
    } catch (err) {
      logger.error(err);
      throw new Error("Failed to remove upload");
    }
  }

  /**
   * Uploads a file to the server storage.
   *
   * @async
   * @function
   * @param {Object} uploadedFile - The uploaded file object.
   * @param {string} folder - The folder where the file should be stored.
   * @returns {Promise<string>}} - The new file path.
   * @throws {Error} - If the file failed to be uploaded.
   */
  async function uploadToStorage(uploadedFile, folder) {
    const path = `${STORAGE_CONFIG.storagePath}/${folder}`;
    try {
      const newPath = uploadedFile.path.replace(STORAGE_CONFIG.tempStoragePath, path.replace(/\/$/, ""));
      try {
        await fs.access(path, fs.constants.F_OK);
      } catch (err) {
        await fs.mkdir(path, { recursive: true });
      }
      await fs.rename(uploadedFile.path, newPath);
      return newPath.replace(`${STORAGE_CONFIG.uploadServerPath}/`, "");
    } catch (e) {
      logger.error(e);
      throw new Error("Upload error");
    }
  }

  /**
   * Uploads a file to the server
   *
   * @async
   * @function
   * @param {Object} uploadedFile - The uploaded file object.
   * @returns {Promise<string>}} - The new file path.
   * @throws {Error} - If the file failed to be uploaded.
   */
  async function upload(uploadedFile) {
    const path = `${STORAGE_CONFIG.uploadServerPath}/`;
    try {
      const newPath = uploadedFile.path.replace(STORAGE_CONFIG.tempStoragePath, path.replace(/\/$/, ""));
      try {
        await fs.access(path, fs.constants.F_OK);
      } catch (err) {
        await fs.mkdir(path, { recursive: true });
      }
      await fs.rename(uploadedFile.path, newPath);
      return newPath.replace(`${STORAGE_CONFIG.uploadServerPath}/`, "");
    } catch (e) {
      logger.error(e);
      throw new Error("Upload error");
    }
  }

  /**
   * Pre-handler for parsing multipart request body to extract values.
   * Parses multipart request body and mutates the request object with the parsed fields.
   */
  function parseMultipartFields(schema) {
    /**
     * @param {import('fastify').FastifyRequest} req - The request object
     * @returns {Promise<void>}
     */
    return async (req) => {
      // @ts-ignore
      if (!req.headers?.["content-type"].includes("multipart/form-data")) {
        throw new UNSUPPORTED_MEDIA_TYPE_415("Multipart/form-data content type is accepted");
      }

      if (!isMappable(req.body)) {
        return;
      }

      const pluckValue = (field) => (field.value !== undefined ? field.value : field);
      const parseValue = (value) => (value === "null" ? null : value);

      const parsedFields = Object.keys(req.body ?? {}).reduce((stack, key) => {
        let value;
        // @ts-ignore
        const field = req.body[key];

        if (Array.isArray(field)) {
          value = field.map((item) => pluckValue(item));
        } else {
          value = pluckValue(field);
        }

        return { ...stack, [key]: parseValue(value) };
      }, {});

      if (schema) {
        validateSchema(req, parsedFields, schema, "body");
      }

      req.body = { ...(req?.body || {}), ...parsedFields };
    };
  }
}

export function toUiPath(filePath) {
  return `${STORAGE_CONFIG.uploadUiPath}/${filePath}`;
}

export function toServerPath(filePath) {
  return `${STORAGE_CONFIG.uploadServerPath}/${filePath}`;
}

export function toUrl(filePath) {
  return filePath ? `${APP_CONFIG.applicationUrl}/${toUiPath(filePath)}` : null;
}

export default fp(uploadPlugin);
