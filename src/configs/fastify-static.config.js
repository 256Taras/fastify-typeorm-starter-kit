import path from "path";

export const fastifyStaticConfig = {
  root: path.resolve("public"),
  setHeaders(res) {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
};
