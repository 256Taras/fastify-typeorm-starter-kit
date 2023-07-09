import { randomUUID } from "node:crypto";

export const fastifyConfig = {
  genReqId: () => randomUUID(),
  disableRequestLogging: true, // we do it on our own
  logger: false,
  requestTimeout: 1000,
  ajv: {
    customOptions: {
      additionalProperties: false,
      removeAdditional: false,
      useDefaults: true,
      coerceTypes: true,
      strictTypes: true,
      strictRequired: true,
      verbose: true,
      // strictRequired: true,
      allErrors: true, // Warning: Enabling this option.js may lead to this security issue https://www.cvedetails.com/cve/CVE-2020-8192/
    },
    plugins: [],
    // plugins: [require("ajv-errors")], // to optionally enable custom error for each constraint
    // localize error is also possible via ajv-i18n:
  },
};
