import { Type } from "@sinclair/typebox";

export const Enum = (object, otp) =>
  Type.Union(
    Object.values(object).map((item) => Type.Literal(item)),
    otp,
  );
