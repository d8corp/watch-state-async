'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var decorators = require('@watch-state/decorators');

var AsyncBreak = Symbol('break');
var ONCE = Symbol('once');
var AsyncOptions = /** @class */ (function () {
    function AsyncOptions(options) {
        Object.assign(this, options);
    }
    tslib.__decorate([
        decorators.state
    ], AsyncOptions.prototype, "loading", void 0);
    tslib.__decorate([
        decorators.state
    ], AsyncOptions.prototype, "loaded", void 0);
    tslib.__decorate([
        decorators.state
    ], AsyncOptions.prototype, "response", void 0);
    tslib.__decorate([
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
        var _a, _b, _c, _d;
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
        var decors = decorators.getDecors(this);
        if (!((_a = decors._loading) === null || _a === void 0 ? void 0 : _a.size) && (((_b = decors._value) === null || _b === void 0 ? void 0 : _b.size) || ((_c = decors._loaded) === null || _c === void 0 ? void 0 : _c.size) || ((_d = decors._error) === null || _d === void 0 ? void 0 : _d.size))) {
            this.forceUpdate();
        }
        return this;
    };
    Async.prototype.forceUpdate = function () {
        var options = this.options;
        this.updated = true;
        if ('request' in options) {
            options.request(this.resolve, this.reject);
        }
        this.trigger('update');
    };
    Async.prototype.checkUpdate = function () {
        if (!this.updated) {
            this.forceUpdate();
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
    tslib.__decorate([
        decorators.event
    ], Async.prototype, "reset", null);
    tslib.__decorate([
        decorators.event
    ], Async.prototype, "update", null);
    tslib.__decorate([
        decorators.event
    ], Async.prototype, "forceUpdate", null);
    tslib.__decorate([
        decorators.event
    ], Async.prototype, "resolve", void 0);
    tslib.__decorate([
        decorators.event
    ], Async.prototype, "reject", void 0);
    tslib.__decorate([
        decorators.cache
    ], Async.prototype, "_loading", null);
    tslib.__decorate([
        decorators.cache
    ], Async.prototype, "_loaded", null);
    tslib.__decorate([
        decorators.cache
    ], Async.prototype, "_default", null);
    tslib.__decorate([
        decorators.cache
    ], Async.prototype, "_response", null);
    tslib.__decorate([
        decorators.cache
    ], Async.prototype, "_error", null);
    tslib.__decorate([
        decorators.cache
    ], Async.prototype, "_value", null);
    tslib.__decorate([
        decorators.event
    ], Async.prototype, "trigger", null);
    tslib.__decorate([
        decorators.event
    ], Async.prototype, "then", null);
    return Async;
}());

exports.Async = Async;
exports.AsyncBreak = AsyncBreak;
exports.AsyncOptions = AsyncOptions;
exports.ONCE = ONCE;
exports.default = Async;
