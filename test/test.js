"use strict";

try {
	console.log;
}
catch (error) {
	window.console = {
		log: function () {
			var pre = document.createElement("pre");
			pre.append(Array.join(arguments, ", "));
			document.body.append(pre);
		}
	};
}

lib.event.when(document.body, "click").then(function () {
	console.log("request start");
	return lib.request.get("MIT-LICENSE.txt").then(function (xhr) {
		var node = document.createElement("blockquote");
		node.append(xhr.responseText);
		document.body.append(node);
	});
}).then(function () {
	console.log("request done");
});

console.log("WeakMap tests:");

var wm = new WeakMap;

var objKey1 = {};
var objKey2 = {};

var objValue1 = {};
var objValue2 = {};
var objValue3 = {};

wm.set(objKey1, objValue1);
wm.set(objKey2, objValue2);
wm.set(objKey1, objValue3);

console.log(wm.has(objKey2));
console.log(wm.get(objKey1) === objValue3);
console.log(wm.get(objKey2) === objValue2);
console.log(wm.delete_({}) === false);
console.log(wm.delete_(objKey2) === true);
console.log(wm.delete_(objKey2) === false);

console.log("Map tests:");

var m = new Map;

m.set(objKey1, objValue1);
m.set(objKey2, objValue2);
m.set(objKey1, objValue3);
m.set("key", "value");
m.set(NaN, Infinity);

console.log(m.has(objKey2));
console.log(m.get(objKey1) === objValue3);
console.log(m.get(objKey2) === objValue2);
console.log(m.delete_({}) === false);
console.log(m.delete_(objKey2) === true);
console.log(m.delete_(objKey2) === false);

console.log("Set tests:");

var s = new Set;

s.add(objValue1);
s.add(objValue2);
s.add(objValue3);

s.add(objValue1);
s.add(NaN);

console.log(s.delete_(NaN) === true);
console.log(s.size === 3);
console.log(s.has(objValue1) === true);

console.log("WeakSet tests:");

var ws = new WeakSet;

ws.add(objValue1);
ws.add(objValue2);
ws.add(objValue1);
ws.delete_(objValue2);

console.log(ws.has(objValue1) === true);
console.log(ws.has(objValue2) === false);
console.log(ws.delete_(objValue1) === true);

console.log("CSS animation test");

window.addEventListener("load", function () {
	var node = document.body.appendChild(document.createElement("div"));
	node.classList.add("animated");
	requestAnimationFrame(function () {
		lib.dom.addClass(node, "move").then(function (element) {
			console.log("CSS animation done");
			return element;
		}).then(function (element) {
			element.remove();
		});
	});
});

console.log("Promise tests");

new Promise(function (resolve) {
	console.log("call promise 1 resolver");
	resolve();
});
new Promise(function (resolve) {
	console.log("call promise 2 resolver");
	resolve();
});
Promise.all([
	new Promise(function (resolve) {
		console.log("call promise 3 resolver");
		resolve();
	}),
	new Promise(function (resolve) {
		console.log("call promise 4 resolver");
		resolve();
	})
]);
Promise.race([
	new Promise(function (resolve) {
		console.log("call promise 5 resolver");
		resolve();
	}),
	new Promise(function (resolve) {
		console.log("call promise 6 resolver");
		resolve();
	})
]);
