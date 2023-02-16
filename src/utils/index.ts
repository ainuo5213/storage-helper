export function isNullOrUndefinedOrEmptyString(val: unknown) {
    return val === undefined || val === null || val === ''
}

export function getType(value: unknown) {
    return Object.prototype.toString.call(value)
}
export function isObject(value: unknown): value is Record<string, unknown> {
    return getType(value) === '[object Object]'
}