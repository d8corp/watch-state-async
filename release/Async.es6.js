import { __classPrivateFieldGet, __classPrivateFieldSet, __runInitializers, __esDecorate, __setFunctionName, __classPrivateFieldIn } from 'tslib';
import { state, event } from '@watch-state/decorators';
import { Observable, queueWatchers, createEvent } from 'watch-state';

var Async = (() => {
    var _Async_instances, _a, _Async_loading_accessor_storage, _Async_loading_get, _Async_loading_set, _Async_loaded_accessor_storage, _Async_loaded_get, _Async_loaded_set, _Async_error_accessor_storage, _Async_error_get, _Async_error_set, _Async_lastCall, _Async_promise, _Async_defaultValue, _Async_handler, _Async_forceUpdate_get, _Async_forcePromise;
    let _instanceExtraInitializers = [];
    let _private_loading_decorators;
    let _private_loading_initializers = [];
    let _private_loading_descriptor;
    let _private_loaded_decorators;
    let _private_loaded_initializers = [];
    let _private_loaded_descriptor;
    let _private_error_decorators;
    let _private_error_initializers = [];
    let _private_error_descriptor;
    let _private_forceUpdate_decorators;
    let _private_forceUpdate_descriptor;
    let _resolve_decorators;
    let _reject_decorators;
    return _a = class Async extends Observable {
            get loaded() {
                __classPrivateFieldGet(this, _Async_instances, "m", _Async_forcePromise).call(this);
                return __classPrivateFieldGet(this, _Async_instances, "a", _Async_loaded_get);
            }
            get loading() {
                __classPrivateFieldGet(this, _Async_instances, "m", _Async_forcePromise).call(this);
                return __classPrivateFieldGet(this, _Async_instances, "a", _Async_loading_get);
            }
            get error() {
                __classPrivateFieldGet(this, _Async_instances, "m", _Async_forcePromise).call(this);
                return __classPrivateFieldGet(this, _Async_instances, "a", _Async_error_get);
            }
            get value() {
                __classPrivateFieldGet(this, _Async_instances, "m", _Async_forcePromise).call(this);
                return super.value;
            }
            resolve(value) {
                __classPrivateFieldSet(this, _Async_instances, false, "a", _Async_loading_set);
                __classPrivateFieldSet(this, _Async_instances, true, "a", _Async_loaded_set);
                __classPrivateFieldSet(this, _Async_instances, undefined, "a", _Async_error_set);
                if (this.rawValue !== value) {
                    this.rawValue = value;
                    queueWatchers(this.observers);
                }
            }
            reject(e) {
                __classPrivateFieldSet(this, _Async_instances, false, "a", _Async_loading_set);
                __classPrivateFieldSet(this, _Async_instances, e, "a", _Async_error_set);
            }
            update(timeout) {
                if (!timeout || __classPrivateFieldGet(this, _Async_lastCall, "f") + timeout > Date.now()) {
                    return __classPrivateFieldGet(this, _Async_instances, "a", _Async_forceUpdate_get).call(this);
                }
            }
            then(resolve, reject) {
                return __classPrivateFieldGet(this, _Async_instances, "m", _Async_forcePromise).call(this).then(resolve, reject);
            }
            catch(reject) {
                return __classPrivateFieldGet(this, _Async_instances, "m", _Async_forcePromise).call(this).catch(reject);
            }
            finally(onFinally) {
                return __classPrivateFieldGet(this, _Async_instances, "m", _Async_forcePromise).call(this).finally(onFinally);
            }
            constructor(handler, defaultValue) {
                super();
                _Async_instances.add(this);
                _Async_loading_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _private_loading_initializers, true)));
                _Async_loaded_accessor_storage.set(this, __runInitializers(this, _private_loaded_initializers, false));
                _Async_error_accessor_storage.set(this, __runInitializers(this, _private_error_initializers, void 0));
                _Async_lastCall.set(this, 0);
                _Async_promise.set(this, void 0);
                _Async_defaultValue.set(this, void 0);
                _Async_handler.set(this, void 0);
                __classPrivateFieldSet(this, _Async_defaultValue, this.rawValue = defaultValue, "f");
                __classPrivateFieldSet(this, _Async_handler, handler, "f");
            }
        },
        _Async_loading_accessor_storage = new WeakMap(),
        _Async_loaded_accessor_storage = new WeakMap(),
        _Async_error_accessor_storage = new WeakMap(),
        _Async_lastCall = new WeakMap(),
        _Async_promise = new WeakMap(),
        _Async_defaultValue = new WeakMap(),
        _Async_handler = new WeakMap(),
        _Async_instances = new WeakSet(),
        _Async_loading_get = function _Async_loading_get() { return _private_loading_descriptor.get.call(this); },
        _Async_loading_set = function _Async_loading_set(value) { return _private_loading_descriptor.set.call(this, value); },
        _Async_loaded_get = function _Async_loaded_get() { return _private_loaded_descriptor.get.call(this); },
        _Async_loaded_set = function _Async_loaded_set(value) { return _private_loaded_descriptor.set.call(this, value); },
        _Async_error_get = function _Async_error_get() { return _private_error_descriptor.get.call(this); },
        _Async_error_set = function _Async_error_set(value) { return _private_error_descriptor.set.call(this, value); },
        _Async_forceUpdate_get = function _Async_forceUpdate_get() { return _private_forceUpdate_descriptor.value; },
        _Async_forcePromise = function _Async_forcePromise() {
            return __classPrivateFieldGet(this, _Async_promise, "f") === undefined ? __classPrivateFieldGet(this, _Async_instances, "a", _Async_forceUpdate_get).call(this) : __classPrivateFieldGet(this, _Async_promise, "f");
        },
        (() => {
            _private_loading_decorators = [state];
            _private_loaded_decorators = [state];
            _private_error_decorators = [state];
            _private_forceUpdate_decorators = [event];
            _resolve_decorators = [event];
            _reject_decorators = [event];
            __esDecorate(_a, _private_loading_descriptor = { get: __setFunctionName(function () { return __classPrivateFieldGet(this, _Async_loading_accessor_storage, "f"); }, "#loading", "get"), set: __setFunctionName(function (value) { __classPrivateFieldSet(this, _Async_loading_accessor_storage, value, "f"); }, "#loading", "set") }, _private_loading_decorators, { kind: "accessor", name: "#loading", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_Async_instances, obj), get: obj => __classPrivateFieldGet(obj, _Async_instances, "a", _Async_loading_get), set: (obj, value) => { __classPrivateFieldSet(obj, _Async_instances, value, "a", _Async_loading_set); } } }, _private_loading_initializers, _instanceExtraInitializers);
            __esDecorate(_a, _private_loaded_descriptor = { get: __setFunctionName(function () { return __classPrivateFieldGet(this, _Async_loaded_accessor_storage, "f"); }, "#loaded", "get"), set: __setFunctionName(function (value) { __classPrivateFieldSet(this, _Async_loaded_accessor_storage, value, "f"); }, "#loaded", "set") }, _private_loaded_decorators, { kind: "accessor", name: "#loaded", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_Async_instances, obj), get: obj => __classPrivateFieldGet(obj, _Async_instances, "a", _Async_loaded_get), set: (obj, value) => { __classPrivateFieldSet(obj, _Async_instances, value, "a", _Async_loaded_set); } } }, _private_loaded_initializers, _instanceExtraInitializers);
            __esDecorate(_a, _private_error_descriptor = { get: __setFunctionName(function () { return __classPrivateFieldGet(this, _Async_error_accessor_storage, "f"); }, "#error", "get"), set: __setFunctionName(function (value) { __classPrivateFieldSet(this, _Async_error_accessor_storage, value, "f"); }, "#error", "set") }, _private_error_decorators, { kind: "accessor", name: "#error", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_Async_instances, obj), get: obj => __classPrivateFieldGet(obj, _Async_instances, "a", _Async_error_get), set: (obj, value) => { __classPrivateFieldSet(obj, _Async_instances, value, "a", _Async_error_set); } } }, _private_error_initializers, _instanceExtraInitializers);
            __esDecorate(_a, _private_forceUpdate_descriptor = { value: __setFunctionName(function () {
                    __classPrivateFieldSet(this, _Async_lastCall, Date.now(), "f");
                    __classPrivateFieldSet(this, _Async_instances, true, "a", _Async_loading_set);
                    __classPrivateFieldSet(this, _Async_promise, __classPrivateFieldGet(this, _Async_handler, "f").call(this).then(createEvent(value => {
                        this.resolve(value);
                        return value;
                    }), createEvent((e) => {
                        this.reject(e);
                        return Promise.reject(e);
                    })), "f");
                    return __classPrivateFieldGet(this, _Async_promise, "f");
                }, "#forceUpdate") }, _private_forceUpdate_decorators, { kind: "method", name: "#forceUpdate", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_Async_instances, obj), get: obj => __classPrivateFieldGet(obj, _Async_instances, "a", _Async_forceUpdate_get) } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _resolve_decorators, { kind: "method", name: "resolve", static: false, private: false, access: { has: obj => "resolve" in obj, get: obj => obj.resolve } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _reject_decorators, { kind: "method", name: "reject", static: false, private: false, access: { has: obj => "reject" in obj, get: obj => obj.reject } }, null, _instanceExtraInitializers);
        })(),
        _a;
})();

export { Async as default };
