import {StorageDataType} from "./types";

export class BaseAdaptor {
    get(key: string): string | null {
        throw new Error('method get must be implemented')
    }

    set(key: string, value: StorageDataType) {
        throw new Error('method set must be implemented')
    }

    remove(key) {
        throw new Error('method remove must be implemented')
    }
}

export class LocalStorageAdaptor extends BaseAdaptor {
    cache = window.localStorage

    get(key: string) {
        return this.cache.getItem(key)
    }

    set(key: string, value: StorageDataType) {
        this.cache.setItem(key, JSON.stringify(value))
    }

    remove(key: string) {
        this.cache.removeItem(key)
    }
}

export class CookieStorageAdaptor extends BaseAdaptor {
    get(key: string) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }

    set(key: string, value: StorageDataType) {
        const cookieBuilder = [`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value.data))}`]
        const expires = `expires=${new Date(+value._expiredAt).toString()}`
        cookieBuilder.push(expires)
        document.cookie = cookieBuilder.join('; ')
    }

    remove(key: string) {
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01, Jan 1970 00:00:00: GMT`
    }
}

export class SessionStorageAdaptor extends BaseAdaptor {
    cache = window.sessionStorage

    get(key: string) {
        return this.cache.getItem(key)
    }

    set(key: string, value: StorageDataType) {
        this.cache.setItem(key, JSON.stringify(value))
    }

    remove(key: string) {
        this.cache.removeItem(key)
    }
}