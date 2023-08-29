import path from "node:path";

import fastifyAuth from "@fastify/auth";
import fastifyCors from "@fastify/cors";
import fastifyAutoLoad from "@fastify/autoload";

import { getDirName } from "#common/utils/common/index.js";
import { FASTIFY_CORS_CONFIG } from "#src/configs/index.js";
// SHARED

const httpPlugin = async (fastify, otp) => {
  fastify.register(fastifyAuth);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fastify.register(fastifyCors, FASTIFY_CORS_CONFIG);

  await fastify.after(); // wait until previous plugin being registered
  // it allows us to be sure that further fastify instance will have fastifyAuth methods available

  const __dirname = getDirName(import.meta.url);
  // Normally you would need to load by hand each plugin. `fastify-autoload` is an utility
  //   we wrote to solve this specific problems. It loads all the content from the specified
  // folder, even the subfolders. Take at look at its documentation, as it's doing a lot more!
  //   First of all, we require all the plugins that we'll need in our application.

  fastify.register(fastifyAutoLoad, {
    dir: path.join(__dirname, "..", "..", "..", "..", "..", "modules"),
    maxDepth: 2,
    matchFilter: (p) => p.endsWith(".router.v1.js"),
    ignorePattern: /d.ts/,
    options: {
      ...otp,
      prefix: null,
    },
  });
};

export default httpPlugin;
