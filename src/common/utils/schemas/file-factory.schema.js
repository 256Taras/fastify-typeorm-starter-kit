import { Type } from "@sinclair/typebox";

export function fileFactorySchema(mimetypes) {
  const baseSchema = {
    encoding: Type.Optional(Type.String()),
    filename: Type.Optional(Type.String()),
    limit: Type.Optional(Type.Boolean()),
  };

  if (mimetypes && mimetypes.length) {
    baseSchema.mimetype = Type.Optional(Type.String({ enum: mimetypes }));
  } else {
    baseSchema.mimetype = Type.Optional(Type.String());
  }

  return Type.Object(baseSchema, { isFile: true });
}
