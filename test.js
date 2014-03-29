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