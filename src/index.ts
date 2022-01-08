import { cache, state, event, getDecors } from '@watch-state/decorators'

export type AsyncValue <V = any> = V | (() => V)

export type AsyncResolve <V = any> = (value: AsyncValue<V>) => AsyncValue<V>
export type AsyncReject <E = any> = (error: AsyncValue<E>) => AsyncValue<E>

export type AsyncThen <V> = (value: V) => any

export type AsyncFunction <V = any, E = any> = (resolve: AsyncResolve<V>, reject: AsyncReject<E>) => void

export type AsyncEvent = () => any
export type AsyncEventType = 'resolve' | 'reject' | 'update'
export type AsyncEvents = Set<AsyncEvent>
export type AsyncEventList = { [key: string]: AsyncEvents }
export type IAsyncOptions <V = any, E = any> = {
  request?: AsyncFunction <V, E>
  timeout?: number
  loading?: boolean
  loaded?: boolean
  events?: AsyncEventList
  default?: V | ((a: Async) => V)
  response?: V | ((a: Async) => V)
  error?: E | ((a: Async) => E)
  resolve?: AsyncResolve<V>
  reject?: AsyncReject<E>
  keepResponse?: boolean
  keepError?: boolean
}

export const AsyncBreak = Symbol('break')
export const ONCE = Symbol('once')

export class AsyncOptions <V = any, E = any> implements IAsyncOptions<V, E> {
  constructor (options: IAsyncOptions) {
    Object.assign(this, options)
  }
  request?: AsyncFunction <V, E>
  timeout?: number
  @state loading?: boolean
  @state loaded?: boolean
  events?: AsyncEventList
  default?: V | ((a: Async) => V)
  @state response?: V | ((a: Async) => V)
  @state error?: E | ((a: Async) => E)
  resolve?: AsyncResolve<V>
  reject?: AsyncReject<E>
  keepResponse?: boolean
  keepError?: boolean
}

export class Async <V = any, E = any> {
  protected readonly options: AsyncOptions
  protected updated: boolean = true
  protected timeout: number

  constructor (request?: AsyncFunction<V, E>, update?: boolean)
  constructor (options?: IAsyncOptions<V, E>, update?: boolean)
  constructor (options: AsyncFunction<V, E> | IAsyncOptions<V, E> = {}, update: boolean = true) {
    this.options = new AsyncOptions(typeof options === 'function' ? { request: options } : options)

    if (update) {
      this.update()
    }
  }

  @event reset () {
    const {options} = this
    options.response = options.default
    options.error = undefined
  }

  @event update (timeout: number = this.options.timeout): this {
    const { options } = this
    if (!options.request) return this
    if (timeout && this.timeout + timeout > Date.now()) return this
    if (options.loading === true) return this
    this.updated = false
    options.loading = true

    const decors = getDecors<{
      _loading: 'cache',
      _value: 'cache',
      _error: 'cache',
      _loaded: 'cache',
    }>(this)

    if (!decors._loading?.size && (decors._value?.size || decors._loaded?.size || decors._error?.size)) {
      this.forceUpdate()
    }
    return this
  }

  @event forceUpdate () {
    const {options} = this
    this.updated = true
    if ('request' in options) {
      options.request(this.resolve, this.reject)
    }
    this.trigger('update')
  }

  checkUpdate () {
    if (!this.updated) {
      this.forceUpdate()
    }
  }

  @event readonly resolve = (response?: AsyncValue<V>): this => {
    const {options} = this

    if (options.resolve) {
      response = options.resolve(response)
    }

    options.loading = false
    options.loaded = true
    options.response = response

    if (!options.keepError) {
      options.error = undefined
    }

    this.timeout = Date.now()
    this.trigger('resolve')
    return this
  }
  @event readonly reject = (error?: AsyncValue<E>): this => {
    const {options} = this

    if (options.reject) {
      error = options.reject(error)
    }

    options.loading = false
    options.error = error

    if (!options.keepResponse) {
      options.response = undefined
    }

    this.trigger('reject')
    return this
  }

  @cache private get _loading (): boolean {
    return this.options.loading || false
  }
  get loading () {
    this.checkUpdate()
    return this._loading
  }

  @cache private get _loaded (): boolean {
    return this.options.loaded || false
  }
  get loaded () {
    this.checkUpdate()
    return this._loaded
  }

  @cache private get _default (): V {
    return typeof this.options.default === 'function' ? this.options.default(this) : this.options.default
  }
  get default () {
    this.checkUpdate()
    return this._default
  }

  @cache private get _response (): V {
    return typeof this.options.response === 'function' ? this.options.response(this) : this.options.response
  }
  get response () {
    this.checkUpdate()
    return this._response
  }


  @cache private get _error (): E {
    this.checkUpdate()
    return typeof this.options.error === 'function' ? this.options.error(this) : this.options.error
  }
  get error () {
    this.checkUpdate()
    return this._error
  }

  @cache private get _value (): V {
    return this.response ?? this.default
  }
  get value () {
    this.checkUpdate()
    return this._value
  }

  // event system
  get events (): AsyncEventList {
    if (!this.options.events) {
      this.options.events = {}
    }
    return this.options.events
  }
  private addEvent (event: string, callback: AsyncEvent) {
    const {events} = this
    if (events[event]) {
      events[event].add(callback)
    } else {
      events[event] = new Set([callback])
    }
  }
  on (event: AsyncEventType | string, callback: AsyncEvent): this {
    callback[ONCE] = false
    this.addEvent(event, callback)
    return this
  }
  once (event: AsyncEventType | string, callback: AsyncEvent): this {
    callback[ONCE] = true
    this.addEvent(event, callback)
    return this
  }
  off (event: AsyncEventType | string, callback: AsyncEvent): this {
    const {options} = this
    if (!options.events || !options.events[event]) return this
    options.events[event].delete(callback)
    return this
  }
  @event trigger (event: AsyncEventType | string): this {
    const {options} = this
    if (!options.events || !options.events[event]) return this
    for (const listener of options.events[event]) {
      if(listener[ONCE]) {
        options.events[event].delete(listener)
      }
      if (listener() === AsyncBreak) {
        break
      }
    }
    return this
  }

  // promise system
  @event then (resolve?: AsyncThen<V>, reject?: AsyncThen<E>): Promise<V> {
    const {options} = this
    if (!options.loading) {
      this.response
    }
    return new Promise((res, rej) => {

      const finish = () => {
        if (this.error) {
          rej(this.error)
        } else {
          res(this.value)
        }
      }

      if (this.loading) {
        this.once('resolve', finish)
        this.once('reject', finish)
      } else {
        finish()
      }
    }).then(resolve, reject)
  }
  catch (reject?: AsyncThen<E>): Promise<V> {
    return this.then(undefined, reject)
  }
  finally (fin?: AsyncThen<V> | AsyncThen<E>): Promise<V> {
    return this.then(fin as AsyncThen<V>, fin as AsyncThen<E>)
  }
}

export default Async
