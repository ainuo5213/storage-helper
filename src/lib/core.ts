import {BaseAdaptor, LocalStorageAdaptor} from './adaptor'
import {MaybeNull, StorageDataType} from "./types";
import {isNullOrUndefinedOrEmptyString, isObject} from "../utils";
import {EndOfLife} from "../utils/constants";

export type StorageHelperOption = {
    key: string
    timeout?: number
    adaptor?: BaseAdaptor
    autoCommit?: boolean
    version?: string
    onStorageChange?: StorageChangeCallback
    incrementalUpdate?: boolean
    forceUpdate?: boolean
}

type StorageChangeCallback = (newValue: unknown, oldValue) => void

export class StorageHelper {
    readonly key: string
    readonly timeout: number
    readonly adaptor: BaseAdaptor
    readonly autoCommit: boolean
    private storageData: unknown
    readonly version: string
    readonly incrementalUpdate: boolean
    private readonly callback: StorageChangeCallback
    readonly forceUpdate: boolean
    constructor(key: string);
    constructor(option: StorageHelperOption);
    constructor(param: string | StorageHelperOption) {
        const localStorageAdaptor = new LocalStorageAdaptor()
        const option = typeof param === 'string' ? ({
            key: param,
        } as StorageHelperOption) : param as StorageHelperOption
        this.key = option.key
        this.adaptor = option.adaptor || localStorageAdaptor
        this.timeout = option.timeout || 0
        this.autoCommit = option.autoCommit || false
        this.version = option.version || ''
        this.storageData = null
        this.callback = option.onStorageChange
        this.incrementalUpdate = option.incrementalUpdate || false
        this.forceUpdate = option.forceUpdate || false
    }

    get<T>(): MaybeNull<T> {
        const data = this._getRawData()
        if (isNullOrUndefinedOrEmptyString(data)) {
            return null
        }
        const cachedData = data.data as T
        if (data._expiredAt <= String(Date.now())) {
            this.storageData = null
            return null
        }
        return cachedData
    }

    private _getRawData() {
        const data = this.adaptor.get(this.key)
        if (isNullOrUndefinedOrEmptyString(data)) {
            return null
        }
        return JSON.parse(data) as StorageDataType
    }

    set(value: unknown) {
        this.storageData = this.incrementalUpdate ? this._incrementalUpdateStorageData(value) : value
        if (this.autoCommit) {
            this.commit()
        }
    }

    private _incrementalUpdateStorageData(value: unknown) {
        if (isObject(this.storageData) && isObject(value)) {
            return {
                ...this.storageData,
                ...value
            }
        } else {
            return value
        }
    }

    private _rawSet(newValue: StorageDataType, oldValue: MaybeNull<StorageDataType>) {
        this.adaptor.set(this.key, newValue)
        typeof this.callback === 'function' && this.callback(newValue.data, oldValue ? oldValue.data : null)
    }

    commit() {
        const now = Date.now()
        const cachedData = this._getRawData()
        let createdAt = String(now)
        let expiredAt = this.timeout === Infinity ? EndOfLife : String(now + this.timeout)
        let currentVersion = this.version
        let lastVersion = currentVersion
        if (!this.forceUpdate && !isNullOrUndefinedOrEmptyString(cachedData)) {
            createdAt = cachedData._createdAt
            expiredAt = cachedData._expiredAt
            lastVersion = cachedData.version || ''
        }
        const isNotSameVersion = currentVersion !== lastVersion
        if (isNotSameVersion) {
            const storageData = {
                data: this.storageData,
                _createdAt: String(now),
                _lastModifiedAt: String(now),
                _expiredAt: String(now + this.timeout),
                version: currentVersion
            } as StorageDataType
            this._rawSet(storageData, cachedData)
            return
        }
        const storageData = {
            data: this.storageData,
            _createdAt: createdAt,
            _lastModifiedAt: String(now),
            _expiredAt: expiredAt,
            version: lastVersion
        } as StorageDataType
        if (!this.forceUpdate && storageData._expiredAt <= String(now)) {
            return
        }
        this._rawSet(storageData, cachedData)
    }
}