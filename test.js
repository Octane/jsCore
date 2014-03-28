"use strict";

console.clear();


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
