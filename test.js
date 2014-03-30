"use strict";

/*
lib.ajax.get("MIT-LICENSE.txt").then(function (data) {

	var pre = document.createElement("pre");
	pre.textContent = data;
	document.body.appendChild(pre);

}).then(function () {

	console.log("ajax promise: 1st then");

}).then(function () {

	console.log("ajax promise: 2nd then");

});
*/

var k = 0;

new Promise(function (resolve, reject) {

	resolve(++k);

}).then(
	function (data) {
		console.log("1 fulfilled");
		return ++k;
	},
	function (error) {
		console.log("1 rejected");
		return error;
	}
).then(
	function (data) {
		console.log("2 fulfilled");
		return ++k;
	},
	function (error) {
		console.log("2 rejected");
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
		return error;
	}
).catch_(
	function (error) {
		console.log("catch: " + error);
		throw Error("catch test error");
		return error;
	}
).then(
	function (data) {
		console.log("4 fulfilled");
		return ++k;
	},
	function (reason) {
		console.log("4 rejected: " + reason);
	}
).then();

console.log("k = " + k);

