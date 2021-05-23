
/**
 * Remove all undefined fields from an object.
 * @param obj The object to remove undefined fields from.
 * @returns `obj` without the undefined fields.
 */
export default function removeUndefined(obj: object): object {
    return (Object.keys(obj) as Array<keyof typeof obj>).reduce((acc, key) => {
        if (obj[key] !== undefined) {
            acc[key] = obj[key];
        }
        return acc;
    }, {} as { [key: string]: any });
}