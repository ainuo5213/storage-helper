import { StorageHelper } from '../'

const storageHelper = new StorageHelper({
    key: 'ainuo5213',
    version: '1.0.0',
    timeout: 24 * 60 * 60 * 1000,
    autoCommit: true,
    incrementalUpdate: true,
    onStorageChange(newValue, oldValue) {
        console.log(newValue, oldValue)
    },
})

storageHelper.set(null)

storageHelper.set({
    name: 'xxx'
})
