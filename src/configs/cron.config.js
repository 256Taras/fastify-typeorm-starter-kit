import { env } from "../../configs/env.js";

export const cronConfig = {
  autorun: env.C === "1",
};
