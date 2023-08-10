import path from "node:path";

export const OFFSET = 0;

export const LIMIT = 100;

export const ORDER_BY = {
  asc: "ASC",
  desc: "DESC",
};

export const STATUS_SUCCESS = { status: true };
export const STATUS_FAIL = { status: false };

export const TOKENS = {
  userJwtData: "userJwtData",
  userCredentials: "userCredentials",
  traceId: "traceId",
};

export const SWAGGER_TAGS = {
  users: ["users"],
  auth: ["auth"],
  income: ["income"],
  mall: ["mall"],
  store: ["store"],
};

export const IMAGE_MIMETYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

export const UPLOAD_UI_PATH = `uploads`;

export const UPLOAD_SERVER_PATH = path.resolve(`public/${UPLOAD_UI_PATH}`);

export const VIEWS_PATH = path.resolve("src/views");

export const TEMP_STORAGE_PATH = path.resolve("storage/temp");

export const STORAGE_PATH = path.resolve("storage");
