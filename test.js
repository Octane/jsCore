"use strict";

var k = 0;

new Promise(function (resolve, reject) {

	resolve(++k);
	//reject(Error("O_o"));
	throw Error("resolver error");

}).then(
	function (data) {
		console.log("1 fulfilled");
		throw Error("1 test error");
		return ++k;
	},
	function (error) {
		console.log("1 rejected");
		//throw Error("1 test error");
		return error;
	}
).then(
	function (data) {
		console.log("2 fulfilled");
		//throw Error("2 test error");
		return ++k;
	},
	function (error) {
		console.log("2 rejected");
		//throw Error("2 test error");
		return error;
	}
).then(
	function (data) {
		console.log("3 fulfilled");
		throw Error("3 test error");
		return ++k;
	},
	function (error) {
		console.log("3 rejected");
		//throw Error("3 test error");
		return error;
	}
).catch_(
	function (error) {
		console.log("catch: " + error.message);
		//throw Error("catch test error");
		return error;
	}
).then(
	function (data) {
		console.log("4 fulfilled");
		//throw Error("4 test error");
		return ++k;
	}
).then();

console.log("k = " + k);

var p1 = new Promise(function (resolve, reject) {
	//resolve("p1 resolve");
	reject(Error("p1 reject"));
});
var p2 = new Promise(function (resolve, reject) {
	resolve("p2 resolve");
	//reject(Error("p2 reject"));
});
var p3 = new Promise(function (resolve, reject) {
	//resolve("p3 resolve");
	reject(Error("p3 reject"));
});

Promise.race([p1, p2, p3]).then(function (data) {
	console.log(data);
}, function (error) {
	console.log(error.message);
});

//lib.ajax.get({url: "MIT-LICENSE.txt"}).then(alert, alert);

/*
var prom = new Promise(function () {});

console.log("resolve " + (Promise.resolve(prom) === prom));
console.log("reject " + (Promise.reject(prom) === prom));
console.log("all " + (Promise.all(prom) === prom));
console.log("race " + (Promise.race(prom) === prom));
*/


/*
function spawn(generatorFunc) {
	function continuer(verb, arg) {
		var result;
		try {
			result = generator[verb](arg);
		}
		catch (err) {
			return Promise.reject(err);
		}
		if (result.done) {
			return result.value;
		} else {
			return Promise.resolve(result.value).then(onFulfilled, onRejected);
		}
	}
	var generator = generatorFunc();
	var onFulfilled = continuer.bind(undefined, "next");
	var onRejected = continuer.bind(undefined, "throw");
	return onFulfilled();
}

function * generator() {


	var promise = new Promise(function (resolve) {
			resolve("O_o");
		});

	var result = yield promise;
	alert(result);

}

//spawn(gen);

var gen = generator(), promise = gen.next().value;

promise.then(function (data) {
	gen.next(data);
});
*/

new function () {

	document.body.addEventListener("custom-event", function (event) {

		console.log(event.type, event.detail);

	});

	var customEvent = document.createEvent("CustomEvent");
	customEvent.initCustomEvent("custom-event", false, false, "works!");

	document.body.dispatchEvent(customEvent);

};


lib.ajax.get("MIT-LICENSE.txt").then(function (data) {

	var pre = document.createElement("pre");
	pre.textContent = data;
	document.body.appendChild(pre);

}).then(function () {

	console.log("ajax promise: 1st then");

})/*.then(function () {

	//console.log("ajax promise: 2nd then");
	//todo fix IE8 stack owerflow

});
*/


/*
function * generatorFunc() {

	var promise1 = new Promise(function (resolve) {
		setTimeout(function () { resolve(1); }, 1000);
	});

	var first = yield promise1;

	var promise2 = new Promise(function (resolve) {
		setTimeout(function () { resolve(first + 1); }, 1000);
	});

	var second = yield promise2;

	var promise3 = new Promise(function (resolve) {
		setTimeout(function () { resolve(second + 1); }, 1000);
	});

	var third = yield promise3;

	alert("result: " + third);

}


var gen = generatorFunc();

gen.next().value.then(function (value) {

	gen.next(value).value.then(function (value) {

		gen.next(value).value.then(function (value) {

			return gen.next(value).value;

		});

	});

});
*/

/*
function spawn(generatorFunc) {

	var generator = generatorFunc();

	function continuer(value) {
		var result = generator.next(value);
		if (result.done) {
			return result.value;
		} else {
			return result.value.then(continuer);
		}
	}

	return continuer();
}

spawn(function * () {

	var promise1 = new Promise(function (resolve) {
		setTimeout(function () { resolve(1); }, 1000);
	});

	var first = yield promise1;

	var promise2 = new Promise(function (resolve) {
		setTimeout(function () { resolve(first + 1); }, 1000);
	});

	var second = yield promise2;

	var promise3 = new Promise(function (resolve) {
		setTimeout(function () { resolve(second + 1); }, 1000);
	});

	var third = yield promise3;

	alert("result: " + third);

});
*/

/*
function promiseQueue(promises) {
	return new Promise(function (resolve) {
		var values = [];
		function fulfill(index) {
			var promise = promises[index];
			if (promise) {
				promise.then(function (value) {
					values[index] = value;
					fulfill(index + 1);
				});
			}
			else {
				resolve(values);
			}
		}
		fulfill(0);
	});
}


var promise1 = new Promise(function (resolve) {
	setTimeout(function () { resolve(1); }, 100);
});

var promise2 = new Promise(function (resolve) {
	setTimeout(function () { resolve(2); }, 100);
});

var promise3 = new Promise(function (resolve) {
	setTimeout(function () { resolve(3); }, 100);
});


promiseQueue([promise1, promise2, promise3]).then(function (value) {
	alert(value);
});
*/

var promise = new Promise(function (resolve, reject) {

	setTimeout(function () {
		resolve(1);
		//reject(Error("test error"));
	}, 100);

});


promise = promise.then(

	function (value) {
		var promise = new Promise(function (resolve, reject) {
			setTimeout(function () {
				resolve(value + 1);
				//reject(Error("test error"));
			}, 100);
		});
		return promise;
	},

	function (reason) {
		return Error("other error");
	}

);

promise = promise.then(

	function (value) {
		console.log(">>>>>>>> " + value);
		return value;
	},

	function (reason) {
		console.log(">>>>>>>> " + reason);
	}

);