"use strict";

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
