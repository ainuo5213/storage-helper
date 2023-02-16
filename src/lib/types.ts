export type MaybeNull<T> = T | null

export type StorageDataType = {
    _createdAt: string
    _lastModifiedAt: string
    _expiredAt: string
    data: unknown
    version: string
}
//
// export type CookieStorageDataType = {
//     domain?: string
//     path?: string
//     secure?: boolean
// } & StorageDataType