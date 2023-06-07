import { Watch } from 'watch-state'

import Async from './Async'

describe('Async', () => {
  test('request', async () => {
    let i = 0
    const async = new Async(async () => i++)
    expect(i).toBe(0)
    expect(await async).toBe(0)
    expect(i).toBe(1)
  })
  describe('api', () => {
    describe('constructor', () => {
      test('argument is empty function', () => {
        new Async(async () => {})
      })

      test('resolve', async () => {
        expect(await new Async(async () => 1)).toBe(1)
      })
      test('reject', async () => {
        const promise = new Async(() => Promise.reject(1))

        try {
          await promise
        } catch (e) {}

        expect(promise.error).toBe(1)
      })
    })
    describe('loading', () => {
      test('complete', () => {
        expect('loading' in new Async(async () => {})).toBe(true)
      })
      test('async', async () => {
        const async = new Async(async () => {})
        expect(async.loading).toBe(true)
        await async
        expect(async.loading).toBe(false)
      })
    })
    describe('loaded', () => {
      test('complete', () => {
        expect('loaded' in new Async(async () => {})).toBe(true)
      })
      test('async', async () => {
        const async = new Async(async () => {})
        expect(async.loaded).toBe(false)
        await async
        expect(async.loaded).toBe(true)
      })
    })
    describe('value', () => {
      test('complete', () => {
        expect('value' in new Async(async () => {})).toBe(true)
      })
      test('async', async () => {
        const async = new Async(async () => 'test')
        expect(async.value).toBe(undefined)
        await async
        expect(async.value).toBe('test')
      })
      test('getter', async () => {
        let i = 0
        const async = new Async(async () => ++i && 'test')
        expect(i).toBe(0)
        await async
        expect(async.value).toBe('test')
        expect(i).toBe(1)
        await async
        expect(async.value).toBe('test')
        expect(i).toBe(1)
      })
    })
    describe('error', () => {
      test('complete', () => {
        expect('error' in new Async(async () => {})).toBe(true)
      })
      test('async', async () => {
        const async = new Async(() => Promise.reject('test'))
        expect(async.error).toBe(undefined)
        let test = false
        try {
          await async
        } catch (e) {
          test = true
          expect(e).toBe('test')
        }
        expect(test).toBe(true)
        expect(async.error).toBe('test')
      })
      test('getter', async () => {
        let i = 0
        const async = new Async(() => Promise.reject(++i && 'test'))
        expect(i).toBe(0)

        try {
          await async
        } catch (e) {}

        expect(async.error).toBe('test')
        expect(i).toBe(1)
        expect(async.error).toBe('test')
        expect(i).toBe(1)
      })
    })
    describe('default', () => {
      test('async', async () => {
        const async = new Async(async () => 2, 1)
        expect(async.value).toBe(1)
        await async
        expect(async.value).toBe(2)
      })
    })
    describe('update', () => {
      test('complete', () => {
        expect('update' in new Async(async () => {})).toBe(true)
      })
      test('async', async () => {
        let i = 0
        const async = new Async(async () => i++)
        expect(async.value).toBe(undefined)
        expect(await async).toBe(0)
        expect(async.value).toBe(0)
        expect(async.value).toBe(0)
        async.update()
        expect(async.value).toBe(0)
        expect(async.value).toBe(0)
        expect(await async).toBe(1)
        expect(async.value).toBe(1)
        expect(async.value).toBe(1)
        expect(await async.update()).toBe(2)
        expect(async.value).toBe(2)
        expect(async.value).toBe(2)
      })
    })
    describe('then', () => {
      test('complete', () => {
        const async = new Async(async () => {})
        expect('then' in async).toBe(true)
      })
      test('returns Promise', () => {
        const async = new Async(async () => {})
        expect(async.then(() => {})).toBeInstanceOf(Promise)
      })
    })
    describe('catch', () => {
      test('complete', () => {
        const async = new Async(async () => {})
        expect('catch' in async).toBe(true)
      })
      test('returns Promise', () => {
        const async = new Async(async () => {})
        expect(async.catch(() => {})).toBeInstanceOf(Promise)
      })
    })
    describe('finally', () => {
      test('complete', () => {
        const async = new Async(async () => {})
        expect('finally' in async).toBe(true)
      })
      test('returns Async', () => {
        const async = new Async(async () => {})
        expect(async.finally(() => {})).toBeInstanceOf(Promise)
      })
    })
  })
  describe('watch', () => {
    test('create in watch without error', () => {
      new Watch(() => new Async(async () => {}))
    })
    describe('value', () => {
      test('async', async () => {
        let i = 1
        const async = new Async(async () => i++)
        const test = []
        new Watch(() => test.push(async.value))
        expect(test.length).toBe(1)
        expect(test[0]).toBe(undefined)
        await async
        expect(test.length).toBe(2)
        expect(test[1]).toBe(1)
        async.update()
        expect(test.length).toBe(2)
        await async
        expect(test.length).toBe(3)
        expect(test[2]).toBe(2)
        expect(async.value).toBe(2)
        async.update()
        expect(test.length).toBe(3)
        await async
        expect(test.length).toBe(4)
        expect(test[3]).toBe(3)
        expect(async.value).toBe(3)
      })
    })
    describe('error', () => {
      test('async', async () => {
        const async = new Async(() => Promise.reject(1))
        const test = []
        new Watch(() => test.push(async.error))
        expect(test.length).toBe(1)
        expect(test[0]).toBe(undefined)
        try {
          await async
          expect(true).toBe(false)
        } catch (e) {
          expect(true).toBe(true)
        }
        expect(test.length).toBe(2)
        expect(test[1]).toBe(1)
      })
    })
  })
  test('update bug', async () => {
    let i = 0
    const a = new Async(async () => i++)

    new Watch(() => a.value)

    expect(i).toBe(1)

    await a.update()

    expect(i).toBe(2)
  })
})
