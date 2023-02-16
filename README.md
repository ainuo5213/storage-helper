`@ainuo-utils/storage-helper` can help processing data more efficiently, no dependency!!!
### setup
```shell
npm install @ainuo-utils/storage-helper
// or
yarn add @ainuo-utils/storage-helper
```

### usage
```javascript
import { StorageHelper } from '@ainuo-utils/storage-helper'

const storageHelper = new StorageHelper({
    key: 'ainuo5213',
    version: '1.0.0',
    timeout: 24 * 60 * 60 * 1000,
    autoCommit: true
})

storageHelper.set({
    userInfo: {
        name: 'ainuo513'
    }
})
```

### api
#### constructor
- `key`: **required**，it's the key of the cache data
- `version`: it's used to control the version of the cache data, if it has changed, the cache data will be overwritten
- `set(value)`: to save the cached data to the data source defined by the adaptor, if the `autoCommit` was switched on
- `get()`: to get the cached data from the data source defined by the adaptor
- `commit()`: to commit change to the data source defined by the adaptor. it will be called when `set`, if it's `true`
- `timeout`: the expire time of the cached data
- `adaptor`: the data source to be defined, if is not defined, it will be `LocalStorageAdaptor`
- `onStorageChange(newValue, oldValue)`: called when storage changed
- `incrementalUpdate`: whether to update cache data incrementally
- `forceUpdate`: force update cache data every time
- `autoCommit`: whether to auto commit storage data change to data source when `set` was called
#### adaptor
- `LocalStorageAdaptor`: the cached data will to be saved to `localStorage`
- `CookieStorageAdaptor`: the cached data will to be saved to `document.cookie`, when cookie expired, there will be storage the newest data to `document.cookie`
- `SessionStorageAdaptor`: the cached data will to be saved to `sessionStorage`, **`expire` not worked**
- `BaseAdaptor`: the abstract adaptor, you also can use `BaseAdaptor` to create a custom adaptor

