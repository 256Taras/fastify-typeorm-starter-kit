import fs from "node:fs";
import { appConfig } from "#configs";

import { TEMP_STORAGE_PATH, UPLOAD_SERVER_PATH, UPLOAD_UI_PATH } from "#constants";
import { logger } from "#services/logger/logger.service.js";

export const toUiPath = (filePath) => `${UPLOAD_UI_PATH}/${filePath}`;

export const toServerPath = (filePath) => `${UPLOAD_SERVER_PATH}/${filePath}`;

export const toUrl = (filePath) => (filePath ? `${appConfig.applicationUrl}/${toUiPath(filePath)}` : null);

export const removeUploadIfExists = (filePath) => {
  const serverPath = toServerPath(filePath);

  if (!fs.existsSync(serverPath)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    fs.unlink(serverPath, (err, res) => {
      if (err) {
        logger.error(err);
      }
      resolve(res);
    });
  });
};

export const uploadFile = async (uploadedFile, folder) => {
  try {
    const newPath = uploadedFile.path.replace(
      TEMP_STORAGE_PATH,
      `${UPLOAD_SERVER_PATH}/${folder}`.replace(/\/$/, ""),
    );

    fs.renameSync(uploadedFile.path, newPath);

    return newPath.replace(`${UPLOAD_SERVER_PATH}/`, "");
  } catch (e) {
    // @ts-ignore
    logger.error(e.message);

    throw new Error("Upload error");
  }
};

/**
 * Track temp uploads to remove them after request completed
 */
export const trackUploads = (req, res, next) => {
  logger.info("Track temp uploads");

  const tempUploads = [];

  const body = req.body || {};

  const handleFileFields = (field) => {
    if (field.path && field.path.startsWith(TEMP_STORAGE_PATH)) {
      tempUploads.push(field.path);
    }
  };

  Object.keys(body).forEach((key) => {
    const field = body[key];

    if (Array.isArray(field)) {
      field.forEach((item) => handleFileFields(item));
    }

    handleFileFields(field);
  });

  if (Array.isArray(req.tmpUploads)) {
    req.tmpUploads = [...req.tmpUploads, ...tempUploads];
  } else {
    req.tmpUploads = tempUploads;
  }

  next();
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
