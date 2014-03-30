"use strict";

window.Promise || new function () {

	var PENDING = 0, SETTLED  = 1;

	function isPromise(anything) {
		return anything instanceof Promise;
	}

	function isSettled(promise) {
		return promise.state == SETTLED;
	}

	function allSettled(promises) {
		return Array.every(promises, isSettled);
	}

	function onFulfilled(value) {
		return value;
	}

	function onRejected(reason) {
		throw reason;
	}

	function Promise(resolver) {
		if (typeof resolver != "function") {
			throw TypeError("Promise resolver is not a function");
		}
		if (!isPromise(this)) {
			return new Promise(resolver);
		}
		this.resolver = resolver;
		this.state = PENDING;
	}

	Object.assign(Promise, {

		resolve: function (value) {
			if (isPromise(value)) {
				//todo thenable value support
				return value.then(onFulfilled, onRejected);
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

		//not implemented in native Promise
		//cast: function () {},

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

		then: function (onFulfilled, onRejected) {

			var promise = this, lastValue;

			function nextResolve(value) {
				setImmediate(function () {
					if (promise.onFulfilled) {
						promise.onFulfilled(value);
					}
				});
			}

			function nextReject(reason) {
				setImmediate(function () {
					if (promise.onRejected) {
						promise.onRejected(reason);
					}
				});
			}

			function resolve(value) {
				setImmediate(function () {
					var crashed;
					lastValue = value;
					if (promise.state == PENDING) {
						promise.state = SETTLED;
						if (onFulfilled) {
							try {
								lastValue = onFulfilled(value);
							}
							catch (error) {
								crashed = true;
								nextReject(error);
							}
						}
						if (!crashed) {
							if (isPromise(lastValue)) {
								lastValue.then(nextResolve, nextReject);
							}
							else {
								nextResolve(lastValue);
							}
						}
					}
				});
			}

			function reject(reason) {
				setImmediate(function () {
					var crashed;
					if (promise.state == PENDING) {
						promise.state = SETTLED;
						if (onRejected) {
							try {
								onRejected(reason);
							}
							catch (error) {
								crashed = true;
								nextReject(error);
							}
						}
						if (!crashed) {
							nextResolve(lastValue);
						}
					}
				});
			}

			try {
				promise.resolver(resolve, reject);
			}
			catch (error) {
				if (promise.state == PENDING) {
					reject(error);
				}
			}

			return new Promise(function (resolve, reject) {
				promise.onFulfilled = resolve;
				promise.onRejected = reject;
			});

		},

		"catch": function (onRejected) {
			return this.then(undefined, onRejected);
		}

	});

	window.Promise = Promise;

};

Promise.prototype.catch_ = Promise.prototype["catch"];
