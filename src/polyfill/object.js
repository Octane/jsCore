"use strict";

//IE9-11 Object.create bug fix
//http://webreflection.blogspot.ru/2014/04/all-ie-objects-are-broken.html
(function () {
	var object = Object.create({});
	object[0] = null;
	return object.hasOwnProperty(0); //→ false in IE9-11
}()) || new function () {
	var create = Object.create;
	function findUndefNumKey(object) {
		var key = 0;
		while (Object.getOwnPropertyDescriptor(object, key)) {
			key++;
		}
		return key;
	}
	Object.create = function (prototype, properties) {
		var object, fixKey;
		if (Object(properties) === properties) {
			fixKey = findUndefNumKey(properties);
			if (!Object.isExtensible(properties)) {
				properties = Object.assign({}, properties);
			}
		}
		else {
			properties = {};
			fixKey = 0;
		}
		//numeric key fixes a bug,
		//it can be removed after,
		//unlike alphabetic key
		properties[fixKey] = {
			configurable: true
		};
		object = create(prototype, properties);
		delete object[fixKey];
		delete properties[fixKey];
		return object;
	};
};

if (!Object.assign) {
	//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
	//https://twitter.com/rwaldron/status/454114058640183296
	//getify http://goo.gl/0QNMDz
	Object.assign = function (target) {
		Array.prototype.slice.call(arguments, 1).forEach(function (source) {
			Object.keys(source).forEach(function (key) {
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
