/**
 * Remove all undefined fields from an object.
 * @param obj The object to remove undefined fields from.
 * @returns `obj` without the undefined fields.
 * @template T The object type.
 */
export default function removeUndefined<T>(obj: T): T {
    const keys = Object.keys(obj)
        .map((key) => key as keyof typeof obj)
        .filter((key) => obj[key as keyof typeof obj] !== undefined);

    return keys.reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {} as T);
}
