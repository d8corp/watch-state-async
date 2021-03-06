<a href="https://www.npmjs.com/package/watch-state">
  <img src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.3/img/logo.svg" align="left" width="90" height="90" alt="Watch-State logo by Mikhail Lysikov">
</a>

# &nbsp; @watch-state/async

&nbsp;

[![NPM](https://img.shields.io/npm/v/@watch-state/async.svg)](https://www.npmjs.com/package/@watch-state/async)
[![downloads](https://img.shields.io/npm/dm/@watch-state/async.svg)](https://www.npmtrends.com/@watch-state/async)
[![downloads](https://img.shields.io/badge/Changelog-⋮-brightgreen)](https://changelogs.xyz/@watch-state/async)
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

`Async` is a `Promise` like constructor
```javascript
import Async from '@watch-state/async'

const promise = new Async((resolve, reject) => {
  fetch('/test').then(resolve, reject)
})
```

### then, catch, finally

`then`, `catch` and `finally` always return instance of `Promise`
```javascript
const test = new Async().then() instanceof Promise
// test === true 
```

Use `then`, `catch` and `finally` like for `Promise`
```javascript
const promise = new Async(resolve => resolve(1))

promise
  .then(value => console.log('then', value))
  .finally(value => console.log('finally', value))
  .catch(value => console.log('catch', value))
```

We have one specific think for watch-state, if you return a function to `resolve` or `reject` then the function will be called when you need to get the result
```javascript
(async () => {
  let test = true

  const promise = new Async(resolve => resolve(() => test = false))
  // test still equals true

  await promise
  // test is false
})()
```

You may override the result at function to fix it
```javascript
(async () => {
  function test () {}
  const promise = new Async(resolve => resolve(() => test))
  const result = await promise
  return result === test // true
})()
```

### loading

You may check status of `Async` with `loading`, it's `true` when data is loading
```javascript
(async () => {
  const promise = new Async(resolve => setTimeout(resolve))
  // promise.loading === true

  await promise
  // promise.loading === false
})()
```

Using watch
```javascript
(async () => {
  const promise = new Async(resolve => setTimeout(resolve))
  
  new Wathc(() => {
    console.log(promise.loading)
  })
  // true
  
  await promise
  // false
})()
```

> You can use the same way to watch on `loaded`, `value`, `default`, `error`, `response`

### loaded

You may check status of `Async` with `loaded`, it's `true` when data was loaded at least one time
```javascript
(async () => {
  const promise = new Async(resolve => setTimeout(resolve))
  // promise.loaded === false

  await promise
  // promise.loaded === true
})()
```

### value

You may get result without `await` synchronously with `value`
```javascript
const promise = new Async(resolve => resolve(1))
// promise.value === 1
```

But `value` returns result at the moment
```javascript
(async () => {
  const promise = new Async(resolve => setTimeout(() => resolve(1)))
  // promise.value === undefined

  await promise
  // promise.value === 1
})()
```

### error

You may handle error without `await` synchronously with `error` like `value` with `resolve`
```javascript
const promise = new Async((resolve, reject) => reject(1))
// promise.error === 1
```

### default

You may provide default `value` for `Async`
```javascript
(async () => {
  const promise = new Async({
    request: resolve => setTimeout(() => resolve(2)),
    default: 1
  })
  // promise.value === 1

  await promise
  // promise.value === 2
})()
```

### response

`response` is the same `value` but without default value
```javascript
(async () => {
  const promise = new Async({
    request: resolve => setTimeout(() => resolve(2)),
    default: 1
  })
  // promise.value === 1
  // promise.response === undefined

  await promise
  // promise.value === 2
  // promise.response === 2
})()
```

### update

Unlike `Promise`, you may reuse `Async` with `update` method
```javascript
let i = 0
const promise = new Async(resolve => resolve(i++))
// i === 1

promise.update()
// i === 2
```

### reset

The method just sets default value as current and clears `error`
```javascript
const promise = new Async({default: 1})
promise.resolve(2) // promise.value = 2
promise.reset() // promise.value = 1
```

### resolve

You may use `resolve` to say async that loading is finished successfully
```javascript
const promise = new Async()
promise.resolve(1)
// promise.value === 1
```

### reject

You may use `reject` to say async that loading is finished with error
```javascript
const promise = new Async()
promise.reject(1)
// promise.error === 1
```

### on, once, off

You may add a listener to react on events.  
Use `resolve`, `reject` or `update` as a type of event.
```javascript
const promise = new Async()
let test = false
promise.on('resolve', () => test = promise.value)
// test === false
promise.resolve(true)
// test === true
promise.resolve(false)
// test === false
```

You may add a listener which reacts only once with `once`
```javascript
const promise = new Async()
let test = false
promise.once('resolve', () => test = promise.value)
// test === false
promise.resolve(true)
// test === true
promise.resolve(false)
// test === true
```

You may turn off a listener
```javascript
const promise = new Async()
let test = false
const listener = () => test = promise.value
promise.on('resolve', listener)
// test === false
promise.resolve(true)
// test === true
promise.off('resolve', listener)
promise.resolve(false)
// test === true
```

## Issues

If you find a bug, please file an issue on [GitHub](https://github.com/d8corp/watch-state-async/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state-async)](https://github.com/d8corp/watch-state-async/issues)

