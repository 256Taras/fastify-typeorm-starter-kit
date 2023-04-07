type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
