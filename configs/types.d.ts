import { Static } from "@sinclair/typebox";
import type { CONFIG_SCHEMA } from "./env.js";

export type Env = Static<typeof CONFIG_SCHEMA>;
