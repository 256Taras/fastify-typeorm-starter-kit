/**
 * A function that filters out null values from an array.
 * @template T The type of the array elements.
 * @param array The input array that may contain null values.
 * @returns  An array containing only the non-null elements of the input array.
 */
export declare const filterNulls: <T>(array: (T | null)[]) => T[];
