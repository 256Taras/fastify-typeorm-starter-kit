import { env } from "../../configs/env.js";

export const awsConfig = {
  cloudWatch: {
    region: env.AWS_CLOUDWATCH_REGION || "",
    credentials: {
      accessKeyId: env.AWS_CLOUDWATCH_ACCESS_KEY_ID || "",
      secretAccessKey: env.AWS_CLOUDWATCH_SECRET_ACCESS_KEY || "",
    },
  },
};
