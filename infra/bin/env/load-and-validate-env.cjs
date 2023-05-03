// @ts-nocheck
// @typescript-eslint/no-var-requires
const { join } = require("path");

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: join(__dirname, "..", "..", "..", "configs", ".env"),
  sample: join(__dirname, "..", "..", "..", "configs", ".env.example"),
});

// eslint-disable-next-line no-process-exit
process.exit(0);
