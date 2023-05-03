export declare const Enum: <T>(
  object: Record<string, T>,
  opt?: Record<string, any>,
) => import("@sinclair/typebox").TUnion<
  import("@sinclair/typebox").TLiteral<import("@sinclair/typebox").TLiteralValue>[]
>;
