'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var decorators = require('@watch-state/decorators');

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

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

var AsyncBreak = Symbol('break');
var ONCE = Symbol('once');
var AsyncOptions = /** @class */ (function () {
    function AsyncOptions(options) {
        Object.assign(this, options);
    }
    __decorate([
        decorators.state
    ], AsyncOptions.prototype, "loading", void 0);
    __decorate([
        decorators.state
    ], AsyncOptions.prototype, "loaded", void 0);
    __decorate([
        decorators.state
    ], AsyncOptions.prototype, "response", void 0);
    __decorate([
        decorators.state
    ], AsyncOptions.prototype, "error", void 0);
    return AsyncOptions;
}());
var Async = /** @class */ (function () {
    function Async(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.updated = true;
        this.resolve = function (response) {
            var options = _this.options;
            if (options.resolve) {
                response = options.resolve(response);
            }
            options.loading = false;
            options.loaded = true;
            options.response = response;
            if (!options.keepError) {
                options.error = undefined;
            }
            _this.timeout = Date.now();
            _this.trigger('resolve');
            return _this;
        };
        this.reject = function (error) {
            var options = _this.options;
            if (options.reject) {
                error = options.reject(error);
            }
            options.loading = false;
            options.error = error;
            if (!options.keepResponse) {
                options.response = undefined;
            }
            _this.trigger('reject');
            return _this;
        };
        this.options = new AsyncOptions(typeof options === 'function' ? { request: options } : options);
        this.update();
    }
    Async.prototype.reset = function () {
        var options = this.options;
        options.response = options.default;
        options.error = undefined;
    };
    Async.prototype.update = function (timeout) {
        if (timeout === void 0) { timeout = this.options.timeout; }
        var options = this.options;
        if (!options.request)
            return this;
        if (timeout && this.timeout + timeout > Date.now())
            return this;
        if (options.loading === true)
            return this;
        this.updated = false;
        options.loading = true;
        return this;
    };
    Async.prototype.checkUpdate = function () {
        if (!this.updated) {
            var options = this.options;
            this.updated = true;
            if ('request' in options) {
                options.request(this.resolve, this.reject);
            }
            this.trigger('update');
        }
    };
    Object.defineProperty(Async.prototype, "_loading", {
        get: function () {
            return this.options.loading || false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "loading", {
        get: function () {
            this.checkUpdate();
            return this._loading;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "_loaded", {
        get: function () {
            return this.options.loaded || false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "loaded", {
        get: function () {
            this.checkUpdate();
            return this._loaded;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "_default", {
        get: function () {
            return typeof this.options.default === 'function' ? this.options.default(this) : this.options.default;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "default", {
        get: function () {
            this.checkUpdate();
            return this._default;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "_response", {
        get: function () {
            return typeof this.options.response === 'function' ? this.options.response(this) : this.options.response;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "response", {
        get: function () {
            this.checkUpdate();
            return this._response;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "_error", {
        get: function () {
            this.checkUpdate();
            return typeof this.options.error === 'function' ? this.options.error(this) : this.options.error;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "error", {
        get: function () {
            this.checkUpdate();
            return this._error;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "_value", {
        get: function () {
            var _a;
            return (_a = this.response) !== null && _a !== void 0 ? _a : this.default;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "value", {
        get: function () {
            this.checkUpdate();
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "events", {
        // event system
        get: function () {
            if (!this.options.events) {
                this.options.events = {};
            }
            return this.options.events;
        },
        enumerable: false,
        configurable: true
    });
    Async.prototype.addEvent = function (event, callback) {
        var events = this.events;
        if (events[event]) {
            events[event].add(callback);
        }
        else {
            events[event] = new Set([callback]);
        }
    };
    Async.prototype.on = function (event, callback) {
        callback[ONCE] = false;
        this.addEvent(event, callback);
        return this;
    };
    Async.prototype.once = function (event, callback) {
        callback[ONCE] = true;
        this.addEvent(event, callback);
        return this;
    };
    Async.prototype.off = function (event, callback) {
        var options = this.options;
        if (!options.events || !options.events[event])
            return this;
        options.events[event].delete(callback);
        return this;
    };
    Async.prototype.trigger = function (event) {
        var e_1, _a;
        var options = this.options;
        if (!options.events || !options.events[event])
            return this;
        try {
            for (var _b = __values(options.events[event]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                if (listener[ONCE]) {
                    options.events[event].delete(listener);
                }
                if (listener() === AsyncBreak) {
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    // promise system
    Async.prototype.then = function (resolve, reject) {
        var _this = this;
        var options = this.options;
        if (!options.loading) {
            this.response;
        }
        return new Promise(function (res, rej) {
            var finish = function () {
                if (_this.error) {
                    rej(_this.error);
                }
                else {
                    res(_this.value);
                }
            };
            if (_this.loading) {
                _this.once('resolve', finish);
                _this.once('reject', finish);
            }
            else {
                finish();
            }
        }).then(resolve, reject);
    };
    Async.prototype.catch = function (reject) {
        return this.then(undefined, reject);
    };
    Async.prototype.finally = function (fin) {
        return this.then(fin, fin);
    };
    __decorate([
        decorators.event
    ], Async.prototype, "reset", null);
    __decorate([
        decorators.event
    ], Async.prototype, "update", null);
    __decorate([
        decorators.event
    ], Async.prototype, "checkUpdate", null);
    __decorate([
        decorators.event
    ], Async.prototype, "resolve", void 0);
    __decorate([
        decorators.event
    ], Async.prototype, "reject", void 0);
    __decorate([
        decorators.cache
    ], Async.prototype, "_loading", null);
    __decorate([
        decorators.cache
    ], Async.prototype, "_loaded", null);
    __decorate([
        decorators.cache
    ], Async.prototype, "_default", null);
    __decorate([
        decorators.cache
    ], Async.prototype, "_response", null);
    __decorate([
        decorators.cache
    ], Async.prototype, "_error", null);
    __decorate([
        decorators.cache
    ], Async.prototype, "_value", null);
    __decorate([
        decorators.event
    ], Async.prototype, "trigger", null);
    __decorate([
        decorators.event
    ], Async.prototype, "then", null);
    return Async;
}());

exports.Async = Async;
exports.AsyncBreak = AsyncBreak;
exports.AsyncOptions = AsyncOptions;
exports.ONCE = ONCE;
exports.default = Async;
