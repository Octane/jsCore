"use strict";

lib.request.get("MIT-LICENSE.txt").then(function (xhr) {

	var node = document.createElement("blockquote");
	node.append(xhr.responseText);
	document.body.append(node);

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

