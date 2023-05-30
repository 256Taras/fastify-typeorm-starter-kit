export declare const deleteEmptyFields: <T extends object>(
  obj: T,
) => Omit<T, keyof { [K in keyof T]: T[K] extends undefined ? K : never }>;
