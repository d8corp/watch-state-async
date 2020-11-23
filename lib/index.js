'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var watchState = require('watch-state');

var AsyncBreak = Symbol('break');
var ONCE = Symbol('once');
var AsyncOptions = /** @class */ (function () {
    function AsyncOptions(options) {
        Object.assign(this, options);
    }
    tslib.__decorate([
        watchState.state
    ], AsyncOptions.prototype, "loading", void 0);
    tslib.__decorate([
        watchState.state
    ], AsyncOptions.prototype, "loaded", void 0);
    tslib.__decorate([
        watchState.state
    ], AsyncOptions.prototype, "response", void 0);
    tslib.__decorate([
        watchState.state
    ], AsyncOptions.prototype, "error", void 0);
    return AsyncOptions;
}());
var Async = /** @class */ (function () {
    function Async(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.updated = true;
        this.resolve = watchState.createEvent(function (response) {
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
        });
        this.reject = watchState.createEvent(function (error) {
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
        });
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
    Async.prototype.call = function () {
        if (this.options.loading && !this.updated) {
            var options = this.options;
            this.updated = true;
            this.trigger('update');
            if ('request' in options) {
                options.request(this.resolve, this.reject);
            }
        }
    };
    Object.defineProperty(Async.prototype, "loading", {
        get: function () {
            this.call();
            return this.options.loading || false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "loaded", {
        get: function () {
            this.call();
            return this.options.loaded || false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "default", {
        get: function () {
            this.call();
            return typeof this.options.default === 'function' ? this.options.default(this) : this.options.default;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "response", {
        get: function () {
            this.call();
            return typeof this.options.response === 'function' ? this.options.response(this) : this.options.response;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "error", {
        get: function () {
            this.call();
            return typeof this.options.error === 'function' ? this.options.error(this) : this.options.error;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Async.prototype, "value", {
        get: function () {
            var _a;
            this.call();
            return (_a = this.response) !== null && _a !== void 0 ? _a : this.default;
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
    Async.prototype.startEvent = function (event) {
        var events = this.events;
        if (!events[event]) {
            events[event] = new Set();
        }
    };
    Async.prototype.on = function (event, callback) {
        var events = this.events;
        this.startEvent(event);
        callback[ONCE] = false;
        events[event].add(callback);
        return this;
    };
    Async.prototype.once = function (event, callback) {
        var events = this.events;
        this.startEvent(event);
        callback[ONCE] = true;
        events[event].add(callback);
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
            for (var _b = tslib.__values(options.events[event]), _c = _b.next(); !_c.done; _c = _b.next()) {
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
        if (options.loading) ;
        else {
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
                var listener_1 = function () {
                    finish();
                    _this.off('resolve', listener_1);
                    _this.off('reject', listener_1);
                };
                _this.once('resolve', listener_1);
                _this.once('reject', listener_1);
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
    tslib.__decorate([
        watchState.event
    ], Async.prototype, "reset", null);
    tslib.__decorate([
        watchState.event
    ], Async.prototype, "update", null);
    tslib.__decorate([
        watchState.cache
    ], Async.prototype, "loading", null);
    tslib.__decorate([
        watchState.cache
    ], Async.prototype, "loaded", null);
    tslib.__decorate([
        watchState.cache
    ], Async.prototype, "default", null);
    tslib.__decorate([
        watchState.cache
    ], Async.prototype, "response", null);
    tslib.__decorate([
        watchState.cache
    ], Async.prototype, "error", null);
    tslib.__decorate([
        watchState.cache
    ], Async.prototype, "value", null);
    return Async;
}());

exports.AsyncBreak = AsyncBreak;
exports.default = Async;
