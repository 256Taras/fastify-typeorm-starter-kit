import fp from "fastify-plugin";

/**
 * A Fastify plugin that creates a dependency injection container using Awilix.
 * @type {import('fastify').FastifyPlugin} app
 */
function utilsPlugin(app, _, done) {
  app.decorate("httpSuccessCode", (code) => (request, reply, payload, done) => {
    //TODO fix it, its not elegant
    if (!payload.includes("developerMessage") && !payload.includes("userMessage")) reply.code(code);
    done(null, payload);
  });
  done();
}

export default fp(utilsPlugin);
