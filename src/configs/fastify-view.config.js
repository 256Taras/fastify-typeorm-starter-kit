import path from "path";
import mustache from "mustache";

export const fastifyViewConfig = {
  engine: { mustache },
  root: path.resolve("src/views"),
};
