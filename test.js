"use strict";

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •

lib.request.get("MIT-LICENSE.txt").then(function (data) {

	var pre = document.createElement("pre");
	pre.append(data);
	document.body.append(pre);

}).then(function () {

	//console.log("ajax promise: 1st then");

}).then(function () {

	//console.log("ajax promise: 2nd then");

});


lib.event.when("click", "body, pre, h1").then(function (event) {

	document.body.prepend("x = " + event.pageX, ", y = " + event.pageY);

});

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •
/*
var promise = new Promise(function (resolve, reject) {

	console.log("resolver called");
	resolve("value-from-resolver");
	//reject("test error");

});

promise.then(function (value) {
	console.log("1 fulfilled: " + value);
	return value;
}, function (reason) {
	console.log("1 rejected: " + reason);
	throw reason;
});

promise.then(function (value) {
	console.log("2 fulfilled: " + value);
	return value;
}, function (reason) {
	console.log("2 rejected: " + reason);
	throw reason;
});

promise.then(function (value) {
	console.log("3 fulfilled: " + value);
	return value;
}, function (reason) {
	console.log("3 rejected: " + reason);
	throw reason;
});

promise.then(function (value) {
	console.log("4 fulfilled: " + value);
	promise.then(function (value) {
		console.log("5 final fulfilled: " + value);
		return value;
	}, function (reason) {
		console.log("5 rejected: " + reason);
		throw reason;
	});
	return value;
}, function (reason) {
	console.log("4 rejected: " + reason);
	promise.then(function (value) {
		console.log("6 final fulfilled: " + value);
		return value;
	}, function (reason) {
		console.log("6 rejected: " + reason);
		throw reason;
	})
	throw reason;
});
*/
// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •
/*
var k = 0;

new Promise(function (resolve, reject) {

	resolve(++k);
	//reject(Error("O_o"));
	++k
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
		//throw Error("3 test error");
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
*/
// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •
/*
var p1 = new Promise(function (resolve, reject) {
	//setTimeout(function () {
		//resolve(">>>p1 resolve");
		reject(Error(">>>p1 reject"));
	//}, 300);
});
p1.name = "p1";
var p2 = new Promise(function (resolve, reject) {
	//setTimeout(function () {
		//resolve(">>>p2 resolve");
		reject(Error(">>>p2 reject"));
	//}, 200);
});
p2.name = "p2";
var p3 = new Promise(function (resolve, reject) {
	//setTimeout(function () {
		//resolve(">>>p3 resolve");
		reject(Error(">>>p3 reject"));
	//}, 100);
});
p3.name = "p3";
var all = Promise.race([p1, p2, p3]);
all.name = "all";
all.then(function (value) {
	console.log("•" + value);
}, function (error) {
	console.log(error.message);
});
*/
// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •
/*
new Promise(function (resolve, reject) {
	console.log("x resolver");
	//resolve(5);
	reject(15);
}).then(function () {}, function (value) {
	console.log("1 fulfill");
	return new Promise(function (resolve) {
		console.log("y resolver");
		resolve(value + 5);
	});
}).then(function (value) {
	console.log("2 fulfill");
	console.log("value: " + value);
},
function (reason) {
	console.log("2 reject");
	console.log("reason: " + reason);
});
*/
