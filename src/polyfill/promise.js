'use strict';

window.Promise || (window.Promise = new function () {

    function toPromise(thenable) {
        if (isPromise(thenable)) {
            return thenable;
        }
        return new Promise(function (resolve, reject) {
            //execute thenable.then asynchronously
            //github.com/getify/native-promise-only/issues/5
            //github.com/domenic/promises-unwrapping/issues/105
            window.setImmediate(function () {
                try {
                    thenable.then(resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    function isPromise(anything) {
        return anything instanceof Promise;
    }

    function isThenable(anything) {
        return Object(anything) === anything &&
               'function' == typeof anything.then;
    }

    function isSettled(promise) {
        return promise._fulfilled || promise._rejected;
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

    function dive(thenable, onFulfilled, onRejected) {
        function interimOnFulfilled(value) {
            if (isThenable(value)) {
                toPromise(value).then(interimOnFulfilled, interimOnRejected);
            } else {
                onFulfilled(value);
            }
        }
        function interimOnRejected(reason) {
            if (isThenable(reason)) {
                toPromise(reason).then(interimOnFulfilled, interimOnRejected);
            } else {
                onRejected(reason);
            }
        }
        toPromise(thenable).then(interimOnFulfilled, interimOnRejected);
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

    Object.assign(Promise, {

        resolve: function (value) {
            if (isThenable(value)) {
                return toPromise(value);
            }
            return new Promise(function (resolve) {
                resolve(value);
            });
        },

        reject: function (reason) {
            return new Promise(function (resolve, reject) {
                reject(reason);
            });
        },

        race: function (values) {
            return new Promise(function (resolve, reject) {
                var value,
                    length = values.length,
                    i = 0;
                while (i < length) {
                    value = values[i];
                    if (isThenable(value)) {
                        dive(value, resolve, reject);
                    } else {
                        resolve(value);
                    }
                    i++;
                }
            });
        },

        all: function (values) {
            return new Promise(function (resolve, reject) {
                var thenables = 0,
                    fulfilled = 0,
                    value,
                    length = values.length,
                    i = 0;
                values = values.slice(0);
                while (i < length) {
                    value = values[i];
                    if (isThenable(value)) {
                        thenables++;
                        dive(
                            value,
                            function (index) {
                                return function (value) {
                                    values[index] = value;
                                    fulfilled++;
                                    if (fulfilled == thenables) {
                                        resolve(values);
                                    }
                                };
                            }(i),
                            reject
                        );
                    } else {
                        //[1, , 3] → [1, undefined, 3]
                        values[i] = value;
                    }
                    i++;
                }
                if (!thenables) {
                    resolve(values);
                }
            });
        }

    });

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
                            reject(error);
                            return;
                        }
                        if (isThenable(value)) {
                            toPromise(value).then(resolve, reject);
                        } else {
                            resolve(value);
                        }
                    });
                }

                function asyncOnRejected() {
                    window.setImmediate(function () {
                        var reason;
                        try {
                            reason = onRejected(promise._reason);
                        } catch (error) {
                            reject(error);
                            return;
                        }
                        if (isThenable(reason)) {
                            toPromise(reason).then(resolve, reject);
                        } else {
                            resolve(reason);
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
