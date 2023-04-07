export const fastifyCsrfConfig = {
  sessionPlugin: "@fastify/cookie",
  cookieOpts: { signed: true },
};
