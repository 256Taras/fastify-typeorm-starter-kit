import fs from "node:fs/promises";

import fp from "fastify-plugin";

import { isMappable } from "#utils/objects/index.js";
import { UNSUPPORTED_MEDIA_TYPE_415 } from "#errors";
import { validateSchema } from "#utils/schemas/index.js";
import { STORAGE_PATH, TEMP_STORAGE_PATH, UPLOAD_SERVER_PATH, UPLOAD_UI_PATH } from "#constants";
import { appConfig } from "#configs";
import { logger } from "#services/logger/logger.service.js";

export const toUiPath = (filePath) => `${UPLOAD_UI_PATH}/${filePath}`;

export const toServerPath = (filePath) => `${UPLOAD_SERVER_PATH}/${filePath}`;

export const toUrl = (filePath) => (filePath ? `${appConfig.applicationUrl}/${toUiPath(filePath)}` : null);

/**
 * A Fastify plugin that creates a dependency injection container using Awilix.
 * @type {import('fastify').FastifyPluginAsync} app
 */
async function uploadPlugin(app, option) {
  /**
   * Removes an uploaded file from the server if it exists.
   *
   * @async
   * @function
   * @param {string} filePath - The path to the uploaded file.
   * @throws {Error} - If the file failed to be removed.
   */
  const removeUploadIfExists = async (filePath) => {
    const serverPath = toServerPath(filePath);

    try {
      // if exist
      await fs.access(serverPath);
      // remove
      await fs.unlink(serverPath);
    } catch (err) {
      logger.error(err);
      throw new Error("Failed to remove upload");
    }
  };
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
  const uploadToStorage = async (uploadedFile, folder) => {
    const path = `${STORAGE_PATH}/${folder}`;

    try {
      const newPath = uploadedFile.path.replace(TEMP_STORAGE_PATH, path.replace(/\/$/, ""));

      try {
        await fs.access(path, fs.constants.F_OK);
      } catch (err) {
        await fs.mkdir(path, { recursive: true });
      }

      await fs.rename(uploadedFile.path, newPath);

      return newPath.replace(`${UPLOAD_SERVER_PATH}/`, "");
    } catch (e) {
      logger.error(e);
      throw new Error("Upload error");
    }
  };

  /**
   * Uploads a file to the server
   *
   * @async
   * @function
   * @param {Object} uploadedFile - The uploaded file object.
   * @returns {Promise<string>}} - The new file path.
   * @throws {Error} - If the file failed to be uploaded.
   */
  const upload = async (uploadedFile) => {
    const path = `${UPLOAD_SERVER_PATH}/`;

    try {
      const newPath = uploadedFile.path.replace(TEMP_STORAGE_PATH, path.replace(/\/$/, ""));

      try {
        await fs.access(path, fs.constants.F_OK);
      } catch (err) {
        await fs.mkdir(path, { recursive: true });
      }

      await fs.rename(uploadedFile.path, newPath);

      return newPath.replace(`${UPLOAD_SERVER_PATH}/`, "");
    } catch (e) {
      logger.error(e);
      throw new Error("Upload error");
    }
  };

  /**
   * Pre-handler for parsing multipart request body to extract values.
   * Parses multipart request body and mutates the request object with the parsed fields.
   */
  const parseMultipartFields =
    (schema) =>
    /**
     * @param {import('fastify').FastifyRequest} req - The request object
     * @returns {Promise<void>}
     */
    async (req) => {
      // @ts-ignore
      if (!req.headers?.["content-type"].includes("multipart/form-data")) {
        throw new UNSUPPORTED_MEDIA_TYPE_415("Multipart/form-data content type is accepted");
      }

      if (!isMappable(req.body)) {
        return;
      }

      const pluckValue = (field) => (field.value !== undefined ? field.value : field);
      const parseValue = (value) => (value === "null" ? null : value);

      const parsedFields = Object.keys(req.body || {}).reduce((stack, key) => {
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

      validateSchema(req, parsedFields, schema, "body");

      req.body = { ...(req?.body || {}), ...parsedFields };
    };
  // @ts-ignore
  app.decorate("parseMultipartFields", option?.parseMultipartFields || parseMultipartFields);
  // @ts-ignore
  app.decorate("removeUploadIfExists", option?.removeUploadIfExists || removeUploadIfExists);
  // @ts-ignore
  app.decorate("uploadToStorage", option?.uploadToStorage || uploadToStorage);
  // @ts-ignore
  app.decorate("upload", option?.upload || upload);
}

export default fp(uploadPlugin);
