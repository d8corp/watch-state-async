import { event, state } from '@watch-state/decorators'
import { createEvent, Observable, queueWatchers } from 'watch-state'

export default class Async<V, E = unknown> extends Observable<V> {
  @state accessor #loading = true
  @state accessor #loaded = false
  @state accessor #error: E

  #lastCall = 0
  #promise: Promise<V>
  readonly #defaultValue: V
  readonly #handler: () => Promise<V>

  get loaded () {
    this.#forcePromise()
    return this.#loaded
  }

  get loading () {
    this.#forcePromise()
    return this.#loading
  }

  get error () {
    this.#forcePromise()
    return this.#error
  }

  get value () {
    this.#forcePromise()
    return super.value
  }

  @event #forceUpdate () {
    this.#lastCall = Date.now()
    this.#loading = true

    this.#promise = this.#handler().then(
      createEvent(value => {
        this.resolve(value)
        return value
      }),
      createEvent((e: E) => {
        this.reject(e)
        return Promise.reject(e)
      }))

    return this.#promise
  }

  @event protected resolve (value: V) {
    this.#loading = false
    this.#loaded = true
    this.#error = undefined

    if (this.rawValue !== value) {
      this.rawValue = value
      queueWatchers(this.observers)
    }
  }

  @event protected reject (e: E) {
    this.#loading = false
    this.#error = e
  }

  update (): Promise<V>
  update (timeout?: number) {
    if (!timeout || this.#lastCall + timeout > Date.now()) {
      return this.#forceUpdate()
    }
  }

  #forcePromise () {
    return this.#promise === undefined ? this.#forceUpdate() : this.#promise
  }

  then<TV, TE> (resolve: (value: V) => TV, reject?: (error: TE) => any) {
    return this.#forcePromise().then(resolve, reject)
  }

  catch<TE> (reject: (error: TE) => any) {
    return this.#forcePromise().catch(reject)
  }

  finally (onFinally: () => void) {
    return this.#forcePromise().finally(onFinally)
  }

  constructor (handler: () => Promise<V>, defaultValue?: V) {
    super()
    this.#defaultValue = this.rawValue = defaultValue
    this.#handler = handler
  }
}
