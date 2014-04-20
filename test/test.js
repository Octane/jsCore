"use strict";

lib.request.get("MIT-LICENSE.txt").then(function (xhr) {

	var node = document.createElement("blockquote");
	node.append(xhr.responseText);
	document.body.append(node);

});

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
