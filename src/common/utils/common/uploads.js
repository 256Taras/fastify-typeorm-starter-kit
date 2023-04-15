import fs from "node:fs/promises";
import { appConfig } from "#configs";

import { TEMP_STORAGE_PATH, UPLOAD_SERVER_PATH, UPLOAD_UI_PATH } from "#constants";
import { logger } from "#services/logger/logger.service.js";

export const toUiPath = (filePath) => `${UPLOAD_UI_PATH}/${filePath}`;

export const toServerPath = (filePath) => `${UPLOAD_SERVER_PATH}/${filePath}`;

export const toUrl = (filePath) => (filePath ? `${appConfig.applicationUrl}/${toUiPath(filePath)}` : null);

export const removeUploadIfExists = async (filePath) => {
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

export const uploadFile = async (uploadedFile, folder) => {
  try {
    const newPath = uploadedFile.path.replace(
      TEMP_STORAGE_PATH,
      `${UPLOAD_SERVER_PATH}/${folder}`.replace(/\/$/, ""),
    );

    await fs.rename(uploadedFile.path, newPath);

    return newPath.replace(`${UPLOAD_SERVER_PATH}/`, "");
  } catch (e) {
    logger.error(e);

    throw new Error("Upload error");
  }
};

/**
 * Parse multipart request body to extract values for manual schema validation
 */
export const parseMultipartFields = (fields) => {
  if (fields === null || fields === undefined) {
    return fields;
  }

  const pluckValue = (field) => (field.value !== undefined ? field.value : field);

  return Object.keys(fields).reduce((stack, key) => {
    let value;
    const field = fields[key];

    if (Array.isArray(field)) {
      value = field.map((item) => pluckValue(item));
    } else {
      value = pluckValue(field);
    }

    return { ...stack, [key]: value };
  }, {});
};
