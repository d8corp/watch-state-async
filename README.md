<a href="https://www.npmjs.com/package/watch-state">
  <img src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.3/img/logo.svg" align="left" width="90" height="90" alt="Watch-State logo by Mikhail Lysikov">
</a>

# &nbsp; @watch-state/async

&nbsp;

[![NPM](https://img.shields.io/npm/v/@watch-state/async.svg)](https://www.npmjs.com/package/@watch-state/async)
[![downloads](https://img.shields.io/npm/dm/@watch-state/async.svg)](https://www.npmtrends.com/@watch-state/async)
[![changelog](https://img.shields.io/badge/Changelog-⋮-brightgreen)](https://changelogs.xyz/@watch-state/async)
[![license](https://img.shields.io/npm/l/@watch-state/async)](https://github.com/d8corp/watch-state-async/blob/main/LICENSE)

Getting async data with [watch-state](https://www.npmjs.com/package/watch-state).

[![stars](https://img.shields.io/github/stars/d8corp/watch-state-async?style=social)](https://github.com/d8corp/watch-state-async/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state-async?style=social)](https://github.com/d8corp/watch-state-async/watchers)

### Installation

npm
```bash
npm i @watch-state/async
```

yarn
```bash
yarn add @watch-state/async
```

### Using

`Async` is a `Promise` like class.

`Async` constructor expects the first required argument as an async function and the second optional one as a default value.
```javascript
import Async from '@watch-state/async'

const promise = new Async(() => fetch('/test'))
```

### then, catch, finally

`then`, `catch` and `finally` always return an instance of `Promise`
```javascript
const test = new Async(async () => {}).then() instanceof Promise
// test === true 
```

Use `then`, `catch` and `finally` like on `Promise`
```javascript
const promise = new Async(async () => 1)

promise
  .then(value => console.log('then', value))
  .finally(value => console.log('finally', value))
  .catch(value => console.log('catch', value))
```

### loading

You may check status of `Async` with `loading`, it's `true` when data is loading
```javascript
const promise = new Async(async () => {})
// promise.loading === true

await promise
// promise.loading === false
```

This is observable field, you can use `Watch` to observe it.
```javascript
const promise = new Async(async () => {})

new Wathc(() => {
  console.log(promise.loading)
})
// true

await promise
// false
```

> You can use the same way to watch on `loaded`, `value`, `error`

### loaded

You may check status of `Async` with `loaded`, it's `true` when data was loaded at least one time
```javascript
const promise = new Async(async () => {})
// promise.loaded === false

await promise
// promise.loaded === true
```

### value

You may get current result by `value` field
```javascript
const promise = new Async(async () => 1)
// promise.value === undefined
await promise
// promise.value === 1
```

### error

You may handle error by `error` field
```javascript
const promise = new Async(() => Promise.reject(1))
new Watch(() => {
  console.log(promise.error)
})
// > undefined
await promise
// > 1
```

### update

Unlike `Promise`, you may reuse `Async` with `update` method
```javascript
let i = 0
const promise = new Async(async () => i++)

console.log(await promise)
// > 0
// i === 1

promise.update()

console.log(await promise)
// > 1
// i === 2
```

You can set timeout to make update only after some time.
```javascript
let i = 0
const promise = new Async(async () => i++)

console.log(await promise)
// > 0
// i === 1

promise.update(1000)
// nothing happends

await promise
// nothing happends

await new Promise(resolve => setTimeout(resolve, 1000))
// nothing happends

// 1 second passed, if use 1000ms it triggers update
promise.update(1000)

console.log(await promise)
// > 1
// i === 2
```

## Issues

If you find a bug, please file an issue on [GitHub](https://github.com/d8corp/watch-state-async/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state-async)](https://github.com/d8corp/watch-state-async/issues)

