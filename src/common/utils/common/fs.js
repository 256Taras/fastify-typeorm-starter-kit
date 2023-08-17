import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export const getDirName = (importMetaUrl) => dirname(fileURLToPath(importMetaUrl));
