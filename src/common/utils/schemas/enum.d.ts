export declare const Enum: <T>(
  object: Record<string, T>,
) => import("@sinclair/typebox").TUnion<
  import("@sinclair/typebox").TLiteral<import("@sinclair/typebox").TLiteralValue>[]
>;
