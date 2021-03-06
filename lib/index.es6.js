import { state, event, cache } from '@watch-state/decorators';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

const AsyncBreak = Symbol('break');
const ONCE = Symbol('once');
class AsyncOptions {
    constructor(options) {
        Object.assign(this, options);
    }
}
__decorate([
    state
], AsyncOptions.prototype, "loading", void 0);
__decorate([
    state
], AsyncOptions.prototype, "loaded", void 0);
__decorate([
    state
], AsyncOptions.prototype, "response", void 0);
__decorate([
    state
], AsyncOptions.prototype, "error", void 0);
class Async {
    constructor(options = {}) {
        this.updated = true;
        this.resolve = (response) => {
            const { options } = this;
            if (options.resolve) {
                response = options.resolve(response);
            }
            options.loading = false;
            options.loaded = true;
            options.response = response;
            if (!options.keepError) {
                options.error = undefined;
            }
            this.timeout = Date.now();
            this.trigger('resolve');
            return this;
        };
        this.reject = (error) => {
            const { options } = this;
            if (options.reject) {
                error = options.reject(error);
            }
            options.loading = false;
            options.error = error;
            if (!options.keepResponse) {
                options.response = undefined;
            }
            this.trigger('reject');
            return this;
        };
        this.options = new AsyncOptions(typeof options === 'function' ? { request: options } : options);
        this.update();
    }
    reset() {
        const { options } = this;
        options.response = options.default;
        options.error = undefined;
    }
    update(timeout = this.options.timeout) {
        const { options } = this;
        if (!options.request)
            return this;
        if (timeout && this.timeout + timeout > Date.now())
            return this;
        if (options.loading === true)
            return this;
        this.updated = false;
        options.loading = true;
        return this;
    }
    checkUpdate() {
        if (!this.updated) {
            const { options } = this;
            this.updated = true;
            if ('request' in options) {
                options.request(this.resolve, this.reject);
            }
            this.trigger('update');
        }
    }
    get _loading() {
        return this.options.loading || false;
    }
    get loading() {
        this.checkUpdate();
        return this._loading;
    }
    get _loaded() {
        return this.options.loaded || false;
    }
    get loaded() {
        this.checkUpdate();
        return this._loaded;
    }
    get _default() {
        return typeof this.options.default === 'function' ? this.options.default(this) : this.options.default;
    }
    get default() {
        this.checkUpdate();
        return this._default;
    }
    get _response() {
        return typeof this.options.response === 'function' ? this.options.response(this) : this.options.response;
    }
    get response() {
        this.checkUpdate();
        return this._response;
    }
    get _error() {
        this.checkUpdate();
        return typeof this.options.error === 'function' ? this.options.error(this) : this.options.error;
    }
    get error() {
        this.checkUpdate();
        return this._error;
    }
    get _value() {
        var _a;
        return (_a = this.response) !== null && _a !== void 0 ? _a : this.default;
    }
    get value() {
        this.checkUpdate();
        return this._value;
    }
    // event system
    get events() {
        if (!this.options.events) {
            this.options.events = {};
        }
        return this.options.events;
    }
    addEvent(event, callback) {
        const { events } = this;
        if (events[event]) {
            events[event].add(callback);
        }
        else {
            events[event] = new Set([callback]);
        }
    }
    on(event, callback) {
        callback[ONCE] = false;
        this.addEvent(event, callback);
        return this;
    }
    once(event, callback) {
        callback[ONCE] = true;
        this.addEvent(event, callback);
        return this;
    }
    off(event, callback) {
        const { options } = this;
        if (!options.events || !options.events[event])
            return this;
        options.events[event].delete(callback);
        return this;
    }
    trigger(event) {
        const { options } = this;
        if (!options.events || !options.events[event])
            return this;
        for (const listener of options.events[event]) {
            if (listener[ONCE]) {
                options.events[event].delete(listener);
            }
            if (listener() === AsyncBreak) {
                break;
            }
        }
        return this;
    }
    // promise system
    then(resolve, reject) {
        const { options } = this;
        if (!options.loading) {
            this.response;
        }
        return new Promise((res, rej) => {
            const finish = () => {
                if (this.error) {
                    rej(this.error);
                }
                else {
                    res(this.value);
                }
            };
            if (this.loading) {
                this.once('resolve', finish);
                this.once('reject', finish);
            }
            else {
                finish();
            }
        }).then(resolve, reject);
    }
    catch(reject) {
        return this.then(undefined, reject);
    }
    finally(fin) {
        return this.then(fin, fin);
    }
}
__decorate([
    event
], Async.prototype, "reset", null);
__decorate([
    event
], Async.prototype, "update", null);
__decorate([
    event
], Async.prototype, "checkUpdate", null);
__decorate([
    event
], Async.prototype, "resolve", void 0);
__decorate([
    event
], Async.prototype, "reject", void 0);
__decorate([
    cache
], Async.prototype, "_loading", null);
__decorate([
    cache
], Async.prototype, "_loaded", null);
__decorate([
    cache
], Async.prototype, "_default", null);
__decorate([
    cache
], Async.prototype, "_response", null);
__decorate([
    cache
], Async.prototype, "_error", null);
__decorate([
    cache
], Async.prototype, "_value", null);
__decorate([
    event
], Async.prototype, "trigger", null);
__decorate([
    event
], Async.prototype, "then", null);

export default Async;
export { Async, AsyncBreak, AsyncOptions, ONCE };
