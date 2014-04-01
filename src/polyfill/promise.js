"use strict";

window.Promise || new function () {

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

	function tryCall(callback, data) {
		//Aurora 30 throws exception outside, Chrome 35 catches.
		try {
			callback(data);
		}
		catch (error) {
		}
	}

	function callEach(callbacks, data) {
		callbacks.forEach(function (callback) {
			setImmediate(tryCall, callback, data);
		});
	}

	function Promise(resolver) {
		if (!isPromise(this)) {
			return new Promise(resolver);
		}
		Object.assign(this, {
			_resolver: resolver,
			_pending: true,
			_fulfilled: false,
			_rejected: false,
			_value: undefined,
			_reason: undefined,
			_onFulfilled: [],
			_onRejected: []
		});
	}

	Object.assign(Promise, {

		resolve: function (value) {
			if (isPromise(value)) {
				return value.then(defaultOnFulfilled, defaultOnRejected);
			}
			return new Promise(function (resolve, reject) {
				resolve(value);
			});
		},

		reject: function (reason) {
			return new Promise(function (resolve, reject) {
				reject(reason);
			});
		},

		race: function (promises) {
			return new Promise(function (resolve, reject) {
				Array.forEach(promises, function (promise) {
					promise.then(resolve, reject);
				});
			});
		},

		all: function (promises) {
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
		}

	});

	Object.assign(Promise.prototype, {

		_enqueue: function (onFulfilled, onRejected) {
			this._onFulfilled.push(onFulfilled || defaultOnFulfilled);
			this._onRejected.push(onRejected || defaultOnRejected);
		},

		_clearQueue: function () {
			this._onFulfilled = [];
			this._onRejected = [];
		},

		then: function (onFulfilled, onRejected) {

			var promise = this, settled;

			function fulfillQueue(value) {
				promise._value = value;
				callEach(promise._onFulfilled, value);
				promise._clearQueue();
			}

			function rejectQueue(reason) {
				promise._reason = reason;
				callEach(promise._onRejected, reason);
				promise._clearQueue();
			}

			function onFulfilledCaller(value) {
				promise._value = value;
				if (!settled) {
					settled = true;
					setImmediate(function () {
						try {
							promise._value = onFulfilled(value);
							promise._fulfilled = true;
						}
						catch (error) {
							promise._reason = error;
							promise._rejected = true;
							rejectQueue(promise._reason);
						}
						if (promise._fulfilled) {
							if (isPromise(promise._value)) {
								promise._value.then(fulfillQueue, rejectQueue);
							}
							else {
								fulfillQueue(promise._value);
							}
						}
					});
				}
			}

			function onRejectedCaller(reason) {
				promise._reason = reason;
				if (!settled) {
					settled = true;
					setImmediate(function () {
						try {
							promise._reason = onRejected(reason);
							promise._rejected = true;
						}
						catch (error) {
							promise._reason = error;
							promise._rejected = true;
							rejectQueue(promise._reason);
						}
						if (promise._rejected) {
							if (isPromise(promise._reason)) {
								promise._reason.then(fulfillQueue, rejectQueue);
							}
							else {
								fulfillQueue(promise._value);
							}
						}
					});
				}
			}

			try {
				if (promise._pending) {
					promise._pending = false;
					promise._resolver(onFulfilledCaller, onRejectedCaller);
				}
				else {
					if (isSettled(promise)) {
						if (promise._fulfilled) {
							onFulfilledCaller(promise._value);
						}
						else {
							onRejectedCaller(promise._reason);
						}
					}
					else {
						promise._enqueue(onFulfilled, onRejected);
					}
				}
			}
			catch (error) {
				if (!isSettled(promise)) {
					onRejectedCaller(error);
				}
			}

			return new Promise(function (resolve, reject) {
				promise._enqueue(resolve, reject);
			});

		},

		"catch": function (onRejected) {
			return this.then(undefined, onRejected);
		}

	});

	window.Promise = Promise;

};

Promise.prototype.catch_ = Promise.prototype["catch"];
