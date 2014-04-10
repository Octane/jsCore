"use strict";

//IE9-11 Object.create bug fix
(function () {
	var object = Object.create({});
	object[0] = null;
	return object.hasOwnProperty(0); //→ false in IE9-11
}()) || new function () {
	var create = Object.create;
	Object.create = function (prototype, properties) {
		//Object.defineProperties fixes a bug
		if (properties) {
			return create(prototype, properties);
		}
		//if Object.create works via new NOP, then
		//Object.create(null) instanceof Object → true,
		//but it's wrong.
		//https://twitter.com/WebReflection/status/454342010288078848
		if (prototype === null) {
			return create(null, {
				"": {
					configurable: true,
					writable: true
				}
			});
		}
		function NOP() {}
		NOP.prototype = prototype;
		return new NOP;
	};
};

if (!Object.assign) {
	//Warning: non-enumerable properties not copied in IE8,
	//because Object.getOwnPropertyNames = Object.keys!
	//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
	//https://twitter.com/rwaldron/status/454114058640183296
	Object.assign = function (target) {
		Array.prototype.slice.call(arguments, 1).forEach(function (source) {
			Object.getOwnPropertyNames(source).forEach(function (key) {
				target[key] = source[key];
			});
		});
		return target;
	};
}

if (!Object.is) {
	Object.is = function (value1, value2) {
		if (value1 === 0 && value2 === 0) {
			return 1 / value1 === 1 / value2;
		}
		if (value1 !== value1) {
			return value2 !== value2;
		}
		return value1 === value2;
	};
}
