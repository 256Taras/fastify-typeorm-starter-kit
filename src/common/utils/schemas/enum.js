import { Type } from "@sinclair/typebox";

export const Enum = (object) => Type.Union(Object.values(object).map((item) => Type.Literal(item)));
