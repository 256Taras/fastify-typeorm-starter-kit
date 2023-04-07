import { fileURLToPath } from "url";
import { dirname } from "path";

export const getDirName = (importMetaUrl) => dirname(fileURLToPath(importMetaUrl));
