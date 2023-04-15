import { Static } from "@sinclair/typebox";

// @ts-ignore
import { CONFIG_SCHEMA } from "./env.js";

export type Env = Static<typeof CONFIG_SCHEMA>;
