'use strict';

window.Promise || (window.Promise = new function () {

    //todo thenable value support

    function isPromise(anything) {
        return anything instanceof Promise;
    }

    function isSettled(promise) {
        return promise._fulfilled || promise._rejected;
    }

    function allSettled(promises) {
        return Array.every(promises, isSettled);
    }

    function defaultOnFulfilled(value) {
        return value;
    }

    function defaultOnRejected(reason) {
        throw reason;
    }

    function call(callback) {
        callback();
    }

    function Promise(resolver) {
        Object.assign(this, {
            _fulfilled: false,
            _rejected: false,
            _value: undefined,
            _reason: undefined,
            _onFulfilled: [],
            _onRejected: []
        });
        this._resolve(resolver);
    }

    Promise.resolve = function (value) {
        if (isPromise(value)) {
            return value.then(defaultOnFulfilled, defaultOnRejected);
        }
        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    Promise.reject = function (reason) {
        return new Promise(function (resolve, reject) {
            reject(reason);
        });
    };

    Promise.race = function (promises) {
        return new Promise(function (resolve, reject) {
            Array.forEach(promises, function (promise) {
                promise.then(resolve, reject);
            });
        });
    };

    Promise.all = function (promises) {
        return new Promise(function (resolve, reject) {
            var values = [];
            Array.forEach(promises, function (promise, index) {
                promise.then(
                    function (value) {
                        values[index] = value;
                        if (allSettled(promises)) {
                            resolve(values);
                        }
                    },
                    reject
                );
            });
        });
    };

    Object.assign(Promise.prototype, {

        _resolve: function (resolver) {

            var promise = this;

            function resolve(value) {
                promise._fulfill(value);
            }

            function reject(reason) {
                promise._reject(reason);
            }

            try {
                resolver(resolve, reject);
            } catch(error) {
                if (!isSettled(promise)) {
                    reject(error);
                }
            }

        },

        _fulfill: function (value) {
            if (!isSettled(this)) {
                this._fulfilled = true;
                this._value = value;
                this._onFulfilled.forEach(call);
                this._clearQueue();
            }
        },

        _reject: function (reason) {
            if (!isSettled(this)) {
                this._rejected = true;
                this._reason = reason;
                this._onRejected.forEach(call);
                this._clearQueue();
            }
        },

        _enqueue: function (onFulfilled, onRejected) {
            this._onFulfilled.push(onFulfilled);
            this._onRejected.push(onRejected);
        },

        _clearQueue: function () {
            this._onFulfilled = [];
            this._onRejected = [];
        },

        then: function (onFulfilled, onRejected) {

            var promise = this;

            return new Promise(function (resolve, reject) {

                onFulfilled = onFulfilled || defaultOnFulfilled;
                onRejected = onRejected || defaultOnRejected;

                function asyncOnFulfilled() {
                    window.setImmediate(function () {
                        var value;
                        try {
                            value = onFulfilled(promise._value);
                        } catch (error) {
                            window.setImmediate(reject, error);
                            return;
                        }
                        if (isPromise(value)) {
                            value.then(resolve, reject);
                        } else {
                            window.setImmediate(resolve, value);
                        }
                    });
                }

                function asyncOnRejected() {
                    window.setImmediate(function () {
                        var reason;
                        try {
                            reason = onRejected(promise._reason);
                        } catch (error) {
                            window.setImmediate(reject, error);
                            return;
                        }
                        if (isPromise(reason)) {
                            reason.then(resolve, reject);
                        } else {
                            window.setImmediate(resolve, reason);
                        }
                    });
                }

                if (promise._fulfilled) {
                    asyncOnFulfilled();
                } else if (promise._rejected) {
                    asyncOnRejected();
                } else {
                    promise._enqueue(asyncOnFulfilled, asyncOnRejected);
                }

            });

        },

        'catch': function (onRejected) {
            return this.then(undefined, onRejected);
        }

    });

    return Promise;

});
