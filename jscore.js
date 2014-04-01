"use strict";

/**
 * jsCore JavaScript library v0.1
 * Copyright 2014, Dmitry Korobkin
 * Released under the MIT license
 * https://github.com/Octane/jsCore/
 */

if (!window.Node) {
	window.Node = {
		ELEMENT_NODE: 1,
		ATTRIBUTE_NODE: 2,
		TEXT_NODE: 3,
		COMMENT_NODE: 8,
		DOCUMENT_NODE: 9,
		DOCUMENT_FRAGMENT_NODE: 11
	};
}

if (!window.HTMLElement) {
	window.HTMLElement = window.Element;
}

"textContent" in document.documentElement || Object.defineProperty(HTMLElement.prototype, "textContent", {
	get: function () {
		return this.innerText;
	},
	set: function (value) {
		this.innerText = value;
	}
});

//IE8 Object.keys polyfill
({toString: null}).propertyIsEnumerable("toString") || new function () {

	//в IE8 переопределенные стандартные методы не становятся enumerable
	var hasBug = [
			"constructor", "toString", "toLocaleString", "valueOf",
			"hasOwnProperty", "propertyIsEnumerable", "isPrototypeOf"
		];

	Object.keys = function (object) {
		var i = hasBug.length, key, keys = [], j = 0;
		for (key in object) {
			if (Object.hasOwnProperty.call(object, key)) {
				keys[j++] = key;
			}
		}
		while (i--) {
			key = hasBug[i];
			if (Object.hasOwnProperty.call(object, key)) {
				keys[j++] = key;
			}
		}
		return keys;
	};

};

if (!Object.create) {
	Object.create = function (prototype) {
		if (arguments.length > 1) {
			throw Error("Object.create implementation only accepts the first parameter");
		}
		function NOP() {}
		NOP.prototype = prototype;
		return new NOP();
	};
}

if (!Array.isArray) {
	Array.isArray = function (anything) {
		return Object.prototype.toString.call(anything) == "[object Array]";
	};
}

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this) {
				func.call(boundThis, this[i], i, this);
			}
			i++;
		}
	};
}

if (!Array.prototype.map) {
	Array.prototype.map = function (func, boundThis) {
		var i = 0, length = this.length, result = [];
		while (i < length) {
			if (i in this) {
				result[i] = func.call(boundThis, this[i], i, this);
			}
			i++;
		}
		return result;
	};
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (anything) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && this[i] === anything) {
				return i;
			}
			i++;
		}
		return -1;
	};
}

if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function (anything) {
		var i = this.length;
		while (i--) {
			if (i in this && this[i] === anything) {
				return i;
			}
		}
		return -1;
	};
}

if (!Array.prototype.filter) {
	Array.prototype.filter = function (func, boundThis) {
		var i = 0, length = this.length, result = [];
		while (i < length) {
			if (i in this && func.call(boundThis, this[i], i, this)) {
				result.push(this[i]);
			}
			i++;
		}
		return result;
	};
}

if (!Array.prototype.every) {
	Array.prototype.every = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && !func.call(boundThis, this[i], i, this)) {
				return false;
			}
			i++;
		}
		return true;
	};
}

if (!Array.prototype.some) {
	Array.prototype.some = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && func.call(boundThis, this[i], i, this)) {
				return true;
			}
			i++;
		}
		return false;
	};
}

if (!Array.prototype.reduce) {
	Array.prototype.reduce = function (func, initialValue) {
		var i = 0, length = this.length, currentValue;
		if (arguments.length < 2) {
			if (!length) {
				throw TypeError("Reduce of empty array with no initial value");
			}
			while (i < length) {
				if (i in this) {
					currentValue = this[i];
					i++;
					break;
				}
				i++;
			}
		}
		else {
			currentValue = initialValue;
		}
		while (i < length) {
			if (i in this) {
				currentValue = func(currentValue, this[i], i, this);
			}
			i++;
		}
		return currentValue;
	};
}

if (!Array.prototype.reduceRight) {
	Array.prototype.reduceRight = function (func, initialValue) {
		var i = this.length, currentValue;
		if (arguments.length < 2) {
			if (!this.length) {
				throw TypeError("Reduce of empty array with no initial value");
			}
			while (i--) {
				if (i in this) {
					currentValue = this[i];
					break;
				}
			}
		}
		else {
			currentValue = initialValue;
		}
		while (i--) {
			if (i in this) {
				currentValue = func(currentValue, this[i], i, this);
			}
		}
		return currentValue;
	};
}

if (!Function.prototype.bind) {

	Function.prototype.bind = new function () {

		function newApply(Constructor, args) {
			var i = 0, len = args.length, argNames = [];
			while (i < len) {
				argNames.push("arg" + i);
				i++;
			}
			argNames = argNames.join(",");
			return Function("Constructor", argNames, "return new Constructor(" + argNames + ")").apply(window, [Constructor].concat(args));
		}

		return function (boundThis) {
			if (typeof this != "function") {
				throw TypeError("Function.prototype.bind called on non-function");
			}
			var targetFunc = this, boundArgs = Array.slice(arguments, 1);
			function boundFunc() {
				var allArgs, len;
				function NOP() {}
				if (boundFunc._protoMagic) {
					boundFunc._protoMagic = false;
					NOP.prototype = this;
					NOP.prototype.constructor = targetFunc;
					return new NOP;
				}
				else {
					allArgs = boundArgs.concat(Array.from(arguments));
					len = allArgs.length;
				}
				if (this && this.constructor == boundFunc) {
					boundFunc._protoMagic = true;
					NOP.prototype = len > 1 ? newApply(targetFunc, allArgs) : (len ? new targetFunc(allArgs[0]) : new targetFunc);
					boundFunc.prototype = new NOP;
					boundFunc.prototype.constructor = boundFunc;
					return new boundFunc;
				}
				return len > 1 ? targetFunc.apply(boundThis, allArgs) : (len ? targetFunc.call(boundThis, allArgs[0]) : targetFunc.call(boundThis));
			}
			boundFunc._protoMagic = false;
			return boundFunc;
		};

	};

}

if (!String.prototype.trim) {
	String.prototype.trim = new function () {
		//http://perfectionkills.com/chr-deviations/
		//https://github.com/kriskowal/es5-shim/
		var whitespace = "[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]",
			//http://blog.stevenlevithan.com/archives/faster-trim-javascript/
			left = RegExp("^" + whitespace + whitespace + "*"),
			right = RegExp(whitespace + whitespace + "*$");
		return function () {
			return this.replace(left, "").replace(right, "");
		};
	};
}

if (!Date.now) {
	Date.now = function () {
		return (new Date).getTime();
	};
}


if (!Object.assign) {
	//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
	Object.assign = function (object, properties) {
		Object.keys(properties).forEach(function (key) {
			object[key] = properties[key];
		});
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


if (!Array.from) {
	Array.from = function (iterable) {
		if (arguments.length > 1) {
			//todo map
			throw Error("Array.from implementation only accepts the first parameter");
		}
		return Object(iterable).length ? Array.slice(iterable, 0) : [];
	};
}

if (!Array.of) {
	Array.of = function () {
		return Array.from(arguments);
	};
}

if (!Array.prototype.find) {
	Array.prototype.find = function (func, boundThis) {
		var i = 0, length = this.length, value;
		while (i < length) {
			if (i in this) {
				value = this[i];
				if (func.call(boundThis, value, i, this)) {
					return value;
				}
			}
			i++;
		}
		return undefined;
	};
}

if (!Array.prototype.findIndex) {
	Array.prototype.findIndex = function (func, boundThis) {
		var i = 0, length = this.length, value;
		while (i < length) {
			if (i in this) {
				value = this[i];
				if (func.call(boundThis, value, i, this)) {
					return i;
				}
			}
			i++;
		}
		return -1;
	};
}

if (!Array.prototype.fill) {
	Array.prototype.fill = function (value, startIndex, endIndex) {
		var i, length = this.length;
		if (typeof startIndex == "undefined") {
			startIndex = 0;
		}
		if (typeof endIndex == "undefined") {
			endIndex = length;
		}
		if (startIndex < 0) {
			i = Math.max(length + startIndex, 0);
		}
		else {
			i = Math.min(startIndex, length);
		}
		while (i < length && i < endIndex) {
			this[i] = value;
			i++;
		}
		return this;
	};
}


if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (string, position) {
		if (typeof position == "undefined") {
			position = 0;
		}
		return this.indexOf(string, position) == position;
	};
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (string, position) {
		var lastIndex;
		position = position || this.length;
		position = position - string.length;
		lastIndex = this.lastIndexOf(string);
		return lastIndex != -1 && lastIndex == position;
	};
}

if (!String.prototype.contains) {
	String.prototype.contains = function (string, position) {
		if (typeof position == "undefined") {
			position = 0;
		}
		return this.indexOf(string, position) != -1;
	};
}

if (!String.prototype.repeat) {
	String.prototype.repeat = function (count) {
		return new Array(count + 1).join(this);
	};
}


if (!Number.MAX_SAFE_INTEGER) {
	Number.MAX_SAFE_INTEGER = 9007199254740991;
}

if (!Number.isFinite) {
	Number.isFinite = function (value) {
		return typeof value == "number" && isFinite(value);
	};
}

if (!Number.isInteger) {
	Number.isInteger = function (value) {
		return typeof value == "number" && isFinite(value) && value > -9007199254740992 && value < 9007199254740992 && Math.floor(value) == value;
	};
}

if (!Number.isNaN) {
	Number.isNaN = function (value) {
		return typeof value == "number" && isNaN(value);
	};
}

if (!Number.toInteger) {
	Number.toInteger = function (value) {
		var number = +value;
		if (isNaN(number)) {
			return +0;
		}
		if (number === 0 || !isFinite(number)) {
			return number;
		}
		return (number < 0 ? -1 : 1) * Math.floor(Math.abs(number));
	};
}

if (!Number.parseInt) {
	Number.parseInt = parseInt;
}

if (!Number.parseFloat) {
	Number.parseFloat = parseFloat;
}
﻿

//Array and String generic methods polyfill
new function () {

	var slice = Array.prototype.slice;

	function fastApply(method, args) {
		var target = args[0];
		switch (args.length) {
			case 1: return method.call(target);
			case 2: return method.call(target, args[1]);
			case 3: return method.call(target, args[1], args[2]);
		}
		return method.apply(target, slice.call(args, 1));
	}

	function createGeneric(method) {
		return function () {
			return fastApply(method, arguments);
		};
	}

	function createGenerics(source, names) {
		return names.reduce(function (methods, name) {
			methods[name] = createGeneric(source[name]);
			return methods;
		}, {});
	}

	function implement(object, methods) {
		Object.keys(methods).forEach(function (name) {
			if (!(name in object)) {
				object[name] = methods[name];
			}
		});
	}

	implement(Array, createGenerics(Array.prototype, [
		"concat", "every", "fill", "filter", "find",
		"findIndex", "forEach", "indexOf", "join",
		"lastIndexOf", "map", "pop", "push", "reduce",
		"reduceRight", "reverse", "shift", "slice",
		"some", "sort", "splice", "unshift"
	]));

	implement(String, createGenerics(String.prototype, [
		"charAt", "charCodeAt", "concat", "contains","endsWith",
		"indexOf", "lastIndexOf", "match", "repeat", "replace",
		"search", "slice", "split", "startsWith", "substr",
		"substring", "toLowerCase", "toUpperCase", "trim"
	]));

};


window.setImmediate || new function () {

	var id = 0, storage = {}, firstCall = true,
		message = "setImmediatePolyfillMessage";

	function fastApply(args) {
		var func = args[0];
		switch (args.length) {
			case 1: return func();
			case 2: return func(args[1]);
			case 3: return func(args[1], args[2]);
		}
		return func.apply(window, Array.slice(args, 1));
	}

	function callback(event) {
		var key, data;
		key = event.data;
		if (typeof key == "string" && key.startsWith(message)) {
			data = storage[key];
			if (data) {
				fastApply(data);
				delete storage[key];
			}
		}
	}

	function setImmediate() {
		var key = message + ++id;
		storage[key] = arguments;
		if (firstCall) {
			firstCall = false;
			addEventListener("message", callback);
		}
		postMessage(key, "*");
		return id;
	}

	function clearImmediate(id) {
		delete storage[message + id];
	}

	window.setImmediate = setImmediate;
	window.clearImmediate = setImmediate;

};


window.Promise || new function () {

	//todo thenable value support

	function isPromise(anything) {
		return anything instanceof Promise;
	}

	function isSettled(promise) {
		return promise._fulfilled || promise._rejected;
	}

	function allSettled(promises) {
		return Array.every(promises, isSettled);
	}

	function defaultOnFulfilled(value) {
		return value;
	}

	function defaultOnRejected(reason) {
		throw reason;
	}

	function tryCall(callback, data) {
		//Aurora 30 throws exception outside, Chrome 35 catches.
		try {
			callback(data);
		}
		catch (error) {
		}
	}

	function callEach(callbacks, data) {
		callbacks.forEach(function (callback) {
			setImmediate(tryCall, callback, data);
		});
	}

	function Promise(resolver) {
		if (!isPromise(this)) {
			return new Promise(resolver);
		}
		Object.assign(this, {
			_resolver: resolver,
			_pending: true,
			_fulfilled: false,
			_rejected: false,
			_value: undefined,
			_reason: undefined,
			_onFulfilled: [],
			_onRejected: []
		});
	}

	Object.assign(Promise, {

		resolve: function (value) {
			if (isPromise(value)) {
				return value.then(defaultOnFulfilled, defaultOnRejected);
			}
			return new Promise(function (resolve, reject) {
				resolve(value);
			});
		},

		reject: function (reason) {
			return new Promise(function (resolve, reject) {
				reject(reason);
			});
		},

		race: function (promises) {
			return new Promise(function (resolve, reject) {
				Array.forEach(promises, function (promise) {
					promise.then(resolve, reject);
				});
			});
		},

		all: function (promises) {
			return new Promise(function (resolve, reject) {
				var values = [];
				Array.forEach(promises, function (promise, index) {
					promise.then(
						function (value) {
							values[index] = value;
							if (allSettled(promises)) {
								resolve(values);
							}
						},
						reject
					);
				});
			});
		}

	});

	Object.assign(Promise.prototype, {

		_enqueue: function (onFulfilled, onRejected) {
			this._onFulfilled.push(onFulfilled || defaultOnFulfilled);
			this._onRejected.push(onRejected || defaultOnRejected);
		},

		_clearQueue: function () {
			this._onFulfilled = [];
			this._onRejected = [];
		},

		then: function (onFulfilled, onRejected) {

			var promise = this, settled;

			function fulfillQueue(value) {
				promise._value = value;
				callEach(promise._onFulfilled, value);
				promise._clearQueue();
			}

			function rejectQueue(reason) {
				promise._reason = reason;
				callEach(promise._onRejected, reason);
				promise._clearQueue();
			}

			function onFulfilledCaller(value) {
				promise._value = value;
				if (!settled) {
					settled = true;
					setImmediate(function () {
						try {
							promise._value = onFulfilled(value);
							promise._fulfilled = true;
						}
						catch (error) {
							promise._reason = error;
							promise._rejected = true;
							rejectQueue(promise._reason);
						}
						if (promise._fulfilled) {
							if (isPromise(promise._value)) {
								promise._value.then(fulfillQueue, rejectQueue);
							}
							else {
								fulfillQueue(promise._value);
							}
						}
					});
				}
			}

			function onRejectedCaller(reason) {
				promise._reason = reason;
				if (!settled) {
					settled = true;
					setImmediate(function () {
						try {
							promise._reason = onRejected(reason);
							promise._rejected = true;
						}
						catch (error) {
							promise._reason = error;
							promise._rejected = true;
							rejectQueue(promise._reason);
						}
						if (promise._rejected) {
							if (isPromise(promise._reason)) {
								promise._reason.then(fulfillQueue, rejectQueue);
							}
							else {
								fulfillQueue(promise._value);
							}
						}
					});
				}
			}

			try {
				if (promise._pending) {
					promise._pending = false;
					promise._resolver(onFulfilledCaller, onRejectedCaller);
				}
				else {
					if (isSettled(promise)) {
						if (promise._fulfilled) {
							onFulfilledCaller(promise._value);
						}
						else {
							onRejectedCaller(promise._reason);
						}
					}
					else {
						promise._enqueue(onFulfilled, onRejected);
					}
				}
			}
			catch (error) {
				if (!isSettled(promise)) {
					onRejectedCaller(error);
				}
			}

			return new Promise(function (resolve, reject) {
				promise._enqueue(resolve, reject);
			});

		},

		"catch": function (onRejected) {
			return this.then(undefined, onRejected);
		}

	});

	window.Promise = Promise;

};

Promise.prototype.catch_ = Promise.prototype["catch"];


window.requestAnimationFrame || new function () {

	window.requestAnimationFrame = [
		window.oRequestAnimationFrame,
		window.msRequestAnimationFrame,
		window.mozRequestAnimationFrame,
		window.webkitRequestAnimationFrame,
		new function () {
			var fps = 60, delay = 1000 / fps, navigationStart, prevCallTime;
			navigationStart = prevCallTime = Date.now();
			return function (callback) {
				var currCallTime = Date.now(),
					timeout = Math.max(0, delay - (currCallTime - prevCallTime)),
					timeToCall = currCallTime + timeout;
				prevCallTime = timeToCall;
				return setTimeout(function () {
					callback(timeToCall - navigationStart);
				}, timeout);
			};
		}
	].find(Boolean);

	window.cancelAnimationFrame = [
		window.oCancelAnimationFrame,
		window.msCancelAnimationFrame,
		window.mozCancelAnimationFrame,
		window.webkitCancelAnimationFrame,
		window.cancelRequestAnimationFrame,
		window.oCancelRequestAnimationFrame,
		window.msCancelRequestAnimationFrame,
		window.mozCancelRequestAnimationFrame,
		window.webkitCancelRequestAnimationFrame,
		window.clearTimeout
	].find(Boolean);

};


function StaticDOMStringMap() {}

"dataset" in document.documentElement || new function () {

	//simple implementation: the new property will not create an attribute

	function toUpperCase(str) {
		return str.charAt(1).toUpperCase();
	}

	function attrToPropName(attrName) {
		return attrName.substr(5).replace(/-./g, toUpperCase);
	}

	function attrToPropDesc(attr) {
		return {
			get: function () {
				return attr.value;
			},
			set: function (value) {
				attr.value = String(value);
			}
		};
	}

	function fillDataset(dataset, attrs) {
		Array.forEach(attrs, function (attr) {
			var attrName = attr.name.toLowerCase();
			if (attrName.startsWith("data-")) {
				Object.defineProperty(dataset, attrToPropName(attrName), attrToPropDesc(attr));
			}
		});
		return dataset;
	}

	Object.defineProperty(HTMLElement.prototype, "dataset", {
		get: function () {
			return fillDataset(new StaticDOMStringMap, this.attributes);
		}
	});

};

"classList" in document.documentElement || new function () {

	//todo InvalidCharacterError, IE11 several arguments support

	function DOMTokenList(getTokens, onChange) {
		this.getTokens = getTokens;
		this.onChange = onChange;
	}

	Object.assign(DOMTokenList.prototype, {

		empty: function () {
			var i = this.length;
			while (i--) {
				delete this[i];
			}
			this.length = 0;
		},

		push: function (tokens) {
			Array.prototype.push.apply(this, tokens);
		},

		update: function () {
			this.empty();
			this.push(this.getTokens());
		},

		item: function (index) {
			this.update();
			return this[index] || null;
		},

		add: function () {
			var length;
			this.update();
			length = this.length;
			Array.forEach(arguments, function (token) {
				if (Array.indexOf(this, token) == -1) {
					Array.push(this, token);
				}
			}, this);
			if (length != this.length) {
				this.onChange();
			}
		},

		remove: function () {
			var length;
			this.update();
			length = this.length;
			Array.forEach(arguments, function (token) {
				var index = Array.indexOf(this, token);
				if (index != -1) {
					Array.splice(this, index, 1);
				}
			}, this);
			if (length != this.length) {
				this.onChange();
			}
		},

		toggle: function (token, force) {
			this.update();
			if (force === false || this.contains(token)) {
				this.remove(token);
				return false;
			}
			this.add(token);
			return true;
		},

		contains: function (token) {
			this.update();
			return Array.indexOf(this, token) != -1;
		},

		toString: function () {
			return Array.join(this, " ");
		}

	});

	function getClasses(className) {
		className = className.trim();
		if (className.length) {
			return className.split(/\s\s*/);
		}
		return [];
	}

	Object.defineProperty(HTMLElement.prototype, "classList", {
		get: function () {
			var element = this;
			if (!element._classList) {
				element._classList = new DOMTokenList(
					function () {
						return getClasses(element.className);
					},
					function () {
						//this → element._classList
						element.className = this.toString();
					}
				);
			}
/*
			//Убрал обновление DOMTokenList по следующим причинам:
			//1. IE11 не обновляет его, когда изменяется свойство className.
			//2. Применение Mutation Events является устаревшим.
			//3. Во избежание утечек памяти.
			element.addEventListener("DOMAttrModified", function (event) {
				if (event.attrName.toLowerCase() == "class") {
					element._classList.update();
				}
			}, false);
*/
			element._classList.update();
			return element._classList;
		}
	});

};

//Element traversal polyfill
"children" in document.createDocumentFragment() || new function () {

	var proto, api = {

		firstElementChild: function () {
			var node = this.firstChild;
			while (node && node.nodeType != 1) {
				node = node.nextSibling;
			}
			return node;
		},

		lastElementChild: function () {
			var node = this.lastChild;
			while (node && node.nodeType != 1) {
				node = node.previousSibling;
			}
			return node;
		},

		nextElementSibling: function () {
			var node = this;
			do {
				node = node.nextSibling;
			}
			while(node && node.nodeType != 1);
			return node;
		},

		previousElementSibling: function () {
			var node = this;
			do {
				node = node.previousSibling;
			}
			while(node && node.nodeType != 1);
			return node;
		},

		childElementCount: function () {
			return this.children.length;
		},

		children: new function () {

			function StaticHTMLCollection() {}

			StaticHTMLCollection.prototype.item = function (index) {
				return this[index] || null;
			};

			return function () {
				var i = 0, node, nodes = this.childNodes, length = nodes.length,
					j = 0, elements = new StaticHTMLCollection;
				while (i < length) {
					node = nodes[i];
					if (node.nodeType == Node.ELEMENT_NODE) {
						elements[j++] = node;
					}
					i++;
				}
				elements.length = j;
				return elements;
			};

		}

	};

	function defineGetter(key) {
		if (!(key in proto)) {
			Object.defineProperty(proto, key, {
				get: api[key]
			});
		}
	}

	proto = HTMLElement.prototype;
	Object.keys(api).forEach(defineGetter);

	[
		document.constructor,
		document.createDocumentFragment().constructor
	].forEach(function (Constructor) {
		proto = Constructor.prototype;
		[
			"firstElementChild", "lastElementChild",
			"childElementCount", "children"
		].forEach(defineGetter);
	});

};

//DOM4 http://www.w3.org/TR/dom/#element
"append" in document.createDocumentFragment() || new function () {

	//todo HierarchyRequestError

	var api, proto = HTMLElement.prototype;

	function isContains(root, element, selector) {
		return Array.indexOf(root.querySelectorAll(selector), element) != -1;
	}

	function mutationMacro(nodes) {
		var length = nodes.length, i, node, fragment;
		if (length == 1) {
			node = nodes[0];
			if (typeof node == "string") {
				return document.createTextNode(node);
			}
			return node;
		}
		fragment = document.createDocumentFragment();
		nodes = Array.from(nodes);
		i = 0;
		while (i < length) {
			node = nodes[i];
			if (typeof node == "string") {
				node = document.createTextNode(node);
			}
			fragment.appendChild(node);
			i++;
		}
		return fragment;
	}

	api = {

		before: function (/* ...nodes */) {
			//todo IE8 removedNode.parentNode != null
			this.parentNode.insertBefore(mutationMacro(arguments), this);
		},

		after: function (/* ...nodes */) {
			var parentNode = this.parentNode,
				nextSibling = this.nextSibling,
				nodes = mutationMacro(arguments);
			if (nextSibling) {
				parentNode.insertBefore(nodes, nextSibling);
			}
			else {
				parentNode.appendChild(nodes);
			}
		},

		replace: function (/* ...nodes */) {
			this.parentNode.replaceChild(mutationMacro(arguments), this);
		},

		remove: function () {
			this.parentNode.removeChild(this);
		},

		append: function (/* ...nodes */) {
			this.appendChild(mutationMacro(arguments));
		},

		prepend: function () {
			this.insertBefore(mutationMacro(arguments), this.firstChild);
		},

		query: function (selector) {
			return this.querySelector(selector);
		},

		queryAll: function (selector) {
			return this.querySelectorAll(selector);
		},

		matches: [
			proto.matchesSelector,
			proto.oMatchesSelector,
			proto.msMatchesSelector,
			proto.mozMatchesSelector,
			proto.webkitMatchesSelector,
			function (selector) {
				var root, contains;
				if (this === document) {
					//если documentFragment.constructor === document.constructor
					return false;
				}
				root = this.parentNode;
				if (root) {
					if (root.nodeType == Node.ELEMENT_NODE) {
						root = root.ownerDocument;
					}
					return isContains(root, this, selector);
				}
				root = document.createDocumentFragment();
				root.appendChild(this);
				contains = isContains(root, this, selector);
				root.removeChild(this);
			}
		].find(Boolean)

	};

	function implement(key) {
		if (!(key in proto)) {
			proto[key] = api[key];
		}
	}

	Object.keys(api).forEach(implement);

	proto = document.constructor;
	["query", "queryAll"].forEach(implement);

	proto = document.createDocumentFragment().constructor.prototype;
	["append", "prepend", "query", "queryAll", "matches"].forEach(implement);

};

//IE8 Array.slice fix
new function () {

	var slice = Array.prototype.slice;

	function toArray(iterable) {
		var i = 0, length = iterable.length, array = [];
		while (i < length) {
			array[i] = iterable[i];
			i++;
		}
		return array;
	}

	try {
		//в IE8 методы массива не работают с DOM-объектами
		Array.slice(document.documentElement.childNodes, 0);
	}
	catch (error) {
		Array.slice = function (iterable, start, end) {
			var length = arguments.length;
			//IE8: NodeList instanceof Object → false
			var array = Object(iterable) instanceof Object ? iterable : toArray(iterable);
			//IE8: [1].slice(0, undefined) → []
			if (length == 1 || (length == 2 && start == 0)) {
				return array == iterable ? slice.call(array, 0) : array;
			}
			if (length == 2) {
				return slice.call(array, start);
			}
			return slice.call(array, start, end);
		};
	}

};

//IE8 dataset polyfill fix
try {
	Object.defineProperty({}, "test", {});
}
catch (error) {
	StaticDOMStringMap = function () {
		return document.createElement("dataset");
	};
}

//IE8 children.length fix (exclude COMMENT_NODE)
(function () {

	var node = document.createElement("div");
	node.appendChild(document.createComment("test"));
	return node.children.length;

}()) && new function () {

	Object.defineProperty(HTMLElement.prototype, "children", {
		get: Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "children").get
	});

};

//IE8 setImmediate polyfill
document instanceof Object || new function () {

	var fakeScript = document.createElement("script"),
		root = document.documentElement;

	//todo code reuse
	function fastApply(args) {
		var func = args[0];
		switch (args.length) {
			case 1: return func();
			case 2: return func(args[1]);
			case 3: return func(args[1], args[2]);
		}
		return func.apply(window, Array.slice(args, 1));
	}

	function setImmediate () {
		var args = arguments, tmpScript = fakeScript.cloneNode(false);
		tmpScript.onreadystatechange = function () {
			fastApply(args);
			tmpScript.onreadystatechange = null;
			root.removeChild(tmpScript);
			tmpScript = null;
		};
		root.appendChild(tmpScript);
		return 0;
	}

	function clearImmediate() {}

	window.setImmediate = setImmediate;
	window.clearImmediate = setImmediate;

};

document.addEventListener || new function () {

	function preventDefault() {
		this.returnValue = false;
	}

	function stopPropagation() {
		this.cancelBubble = true;
	}

	function fixEvent(event) {
		var clone = document.createEventObject(event);
		clone.target = clone.srcElement;
		clone.pageX = clone.clientX + document.documentElement.scrollLeft;
		clone.pageY = clone.clientY + document.documentElement.scrollTop;
		clone.preventDefault = preventDefault;
		clone.stopPropagation = stopPropagation;
		return clone;
	}

	function fastBind(func, boundThis) {
		return function (arg) {
			func.call(boundThis, arg);
		};
	}

	function createEventListener(callbacks, element) {
		return function (event) {
			var i = 0, length = callbacks.length, type;
			if (event instanceof CustomEvent) {
				event.target = element;
			}
			else {
				event = fixEvent(event);
			}
			while (i < length) {
				setImmediate(fastBind(callbacks[i], element), event);
				i++;
			}
		};
	}

	function addEventListener(eventType, callback, useCapturing) {
		var element = this, events, event;
		if (useCapturing) {
			throw new Error("Capturing phase is not supported");
		}
		if (!element._events) {
			element._events = {};
		}
		events = element._events;
		event = events[eventType];
		if (!event) {
			event = {
				callbacks: []
			};
			event.listener = createEventListener(event.callbacks, element);
			events[eventType] = event;
			//todo exclude custom event
			this.attachEvent("on" + eventType, event.listener);
		}
		if (event.callbacks.indexOf(callback) == -1) {
			event.callbacks.push(callback);
		}
	}

	function removeEventListener(eventType, callback, useCapturing) {
		var element = this, events, event, index, callbacks;
		if (useCapturing) {
			throw new Error("Capturing phase is not supported");
		}
		if (!element._events) {
			return;
		}
		events = element._events;
		if (!events[eventType]) {
			return;
		}
		event = events[eventType];
		callbacks = event.callbacks;
		index = callbacks.indexOf(callback);
		if (index == -1) {
			return;
		}
		callbacks.splice(index, 1);
		if (!callbacks.length) {
			element.detachEvent("on" + eventType, event.listener);
			delete events[eventType];
		}
	}

	//todo поставить в соответсвие параметры функций свойствам объекта события в IE
	function initEvent(type, bubbles, cancelable) {
		Object.assign(this, {
			type: type,
			bubbles: bubbles,
			cancelable: cancelable
		});
	}

	function initUIEvent(type, bubbles, cancelable, windowObject, detail) {
		Object.assign(this, {
			type: type,
			bubbles: bubbles,
			cancelable: cancelable,
			windowObject: windowObject,
			detail: detail
		});
	}

	function initMouseEvent(type, bubbles, cancelable, windowObject, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) {
		Object.assign(this, {
			type: type,
			bubbles: bubbles,
			cancelable: cancelable,
			windowObject: windowObject,
			detail: detail,
			screenX: screenX,
			screenY: screenY,
			clientX: clientX,
			clientY: clientY,
			ctrlKey: ctrlKey,
			altKey: altKey,
			shiftKey: shiftKey,
			metaKey: metaKey,
			button: button,
			relatedTarget: relatedTarget
		});
	}

	//deprecated
	function initMutationEvent(type, bubbles, cancelable, relatedNode, prevValue, newValue, attrName, attrChange) {
		Object.assign(this, {
			type: type,
			bubbles: bubbles,
			cancelable: cancelable,
			relatedNode: relatedNode,
			prevValue: prevValue,
			newValue: newValue,
			attrName: attrName,
			attrChange: attrChange
		});
	}

	function initKeyEvent(type, bubbles, cancelable, windowObject, ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode) {
		Object.assign(this, {
			type: type,
			bubbles: bubbles,
			cancelable: cancelable,
			windowObject: windowObject,
			ctrlKey: ctrlKey,
			altKey: altKey,
			shiftKey: shiftKey,
			metaKey: metaKey,
			keyCode: keyCode,
			charCode: charCode
		});
	}

	function CustomEvent() {}

	CustomEvent.prototype.initCustomEvent = function (type, bubbles, cancelable, detail) {
		Object.assign(this, {
			type: type,
			bubbles: bubbles,
			cancelable: cancelable,
			detail: detail
		});
	}

	function dispatchEvent(event) {
		var events;
		if (event instanceof CustomEvent) {
			events = this._events;
			if (events && events[event.type]) {
				events[event.type].listener(event);
			}
		}
		else {
			this.fireEvent("on" + event.type, event);
		}
	}

	[Window, HTMLDocument, HTMLElement, XMLHttpRequest].forEach(function (eventTarget) {
		var proto = eventTarget.prototype;
		proto.dispatchEvent = dispatchEvent;
		proto.addEventListener = addEventListener;
		proto.removeEventListener = removeEventListener;
	});

	HTMLDocument.prototype.createEvent = function (group) {
		if (group == "CustomEvent") {
			return new CustomEvent;
		}
		return Object.assign(document.createEventObject(), {
			initEvent: initEvent,
			initUIEvent: initUIEvent,
			initKeyEvent: initKeyEvent,
			initMouseEvent: initMouseEvent,
			initMutationEvent: initMutationEvent
		});
	};

};

"onload" in new XMLHttpRequest || new function () {

	var refreshRate = 100, proto = XMLHttpRequest.prototype,
		send = proto.send, abort = proto.abort;

	function fireEvent(xhr, eventType, detail) {
		var event = document.createEvent("CustomEvent");
		event.initCustomEvent(eventType, false, false, null);
		xhr.dispatchEvent(event);
		event.target = xhr;
		eventType = "on" + eventType;
		if (xhr[eventType]) {
			setImmediate(function () {
				xhr[eventType](event);
			});
		}
	}

	proto.send = function (data) {
		var xhr = this;
		function check() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 400) {
					fireEvent(xhr, "load");
				}
				else {
					fireEvent(xhr, "error");
				}
			}
			else {
				xhr.timeoutId = setTimeout(check, refreshRate);
			}
		}
		//todo send FormData
		send.call(xhr, arguments.length ? data : null);
		xhr.timeoutId = setTimeout(check, refreshRate);
	};

	proto.abort = function () {
		var xhr = this;
		clearTimeout(xhr.timeoutId);
		abort.call(xhr);
		fireEvent(xhr, "abort");
	};

};

window.getComputedStyle || new function () {

	function CSSStyleDeclaration() {
		return document.createElement("compStyle");
	}

	function toUpperCase(str) {
		return str.charAt(1).toUpperCase();
	}

	function toCamelCase(propName) {
		return propName.replace(/-./g, toUpperCase);
	}

	function getPropertyValue(propName) {
		propName = propName.toLowerCase();
		return this[propName == "float" ? "cssFloat" : toCamelCase(propName)];
	}

	function createPropDesc(obj, propName) {
		return {
			get: function () {
				return obj[propName];
			}
		};
	}

	function createCSSFloatDesc(obj) {
		return {
			get: function () {
				return obj.styleFloat;
			}
		};
	}

	function getComputedStyle(element) {
		var compStyle = element._compStyle, currStyle;
		if (!compStyle) {
			compStyle = element._compStyle = new CSSStyleDeclaration;
			currStyle = element.currentStyle;
			Object.keys(currStyle).forEach(function (propName) {
				Object.defineProperty(compStyle, propName, createPropDesc(currStyle, propName));
			});
			Object.defineProperty(compStyle, "cssFloat", createCSSFloatDesc(currStyle));
			compStyle.getPropertyValue = getPropertyValue;
		}
		return compStyle;
	}

	window.getComputedStyle = getComputedStyle;

};


var lib = {};


Object.assign(lib, {

	//example: if (tests.every(lib.isTrue))
	isTrue: function (bool) {
		return bool === true;
	},

	isFalse: function (bool) {
		return bool === false;
	},

	isHTML: function (string) {
		return string.startsWith("<") && string.endsWith(">");
	},

	isObject: function (anything) {
		return Object(anything) === anything;
	},

	isHTMLElement: function (anything) {
		return anything instanceof HTMLElement;
	}

});


lib.class_ = {

	extend: function (Class, SuperClass) {
		Class.prototype = Object.create(SuperClass.prototype);
		Class.prototype.constructor = Class;
		Class.super_ = SuperClass;
		return Class;
	}

};


lib.array = {

	//подсчет реального количсества элементов
	//http://javascript.ru/forum/misc/25392-rabota-s-massivom.html#post155335
	count: function (iterable) {
		return Array.reduce(iterable, function (length) {
			return length + 1;
		}, 0);
	},

	contains: function (iterable, anything, position) {
		return Array.indexOf(iterable, anything, position) != -1;
	},

	unique: function (iterable) {
		var anything, array = [], i = 0, j = 0, length = iterable.length;
		while (i < length) {
			anything = iterable[i];
			if (array.indexOf(anything) == -1) {
				array[j++] = anything;
			}
			i++;
		}
		return array;
	},

	//Array.every игнорирует пропущенные индексы,
	//и всегда возвращает true для пустого массива
	all: function (iterable, func, boundThis) {
		var i = Object(iterable).length;
		if (!i) {
			return false;
		}
		while (i--) {
			if (i in iterable) {
				if (!func.call(boundThis, iterable[i])) {
					return false;
				}
			}
			else {
				return false;
			}
		}
		return true;
	},

	//удаляет несуществующие индексы
	refine: function (iterable) {
		return Array.reduce(iterable, function (array, anything) {
			array.push(anything);
			return array;
		}, []);
	}

};


lib.event = {

	//example: element.addEventListener("click", lib.event.preventDefault, false)
	preventDefault: function (event) {
		event.preventDefault();
	},

	stopPropagation: function (event) {
		event.stopPropagation();
	},

	//returns promise
	when: function (eventType, selector, root) {
		return Promise.resolve(new Promise(function (resolve) {
			lib.event.one(eventType, selector, root, resolve);
		}));
	},

	one: function (eventType, selector, root, callback) {
		var eventDetails = lib.event.on(eventType, selector, root, function (event) {
			lib.event.off(eventDetails);
			callback(event);
		});
		return eventDetails;
	},

	//returns event details
	on: function (eventType, selector, root, callback) {
		var listener;
		if (typeof root == "function") {
			callback = root;
			root = document;
		}
		if (typeof selector != "string") {
			root = selector;
			selector = "";
		}
		if (!root) {
			root = document;
		}
		if (selector) {
			listener = function (event) {
				var target = event.target;
				if (target.matches && target.matches(selector)) {
					callback.call(root, event);
				}
			};
		}
		else {
			listener = callback;
		}
		root.addEventListener(eventType, listener);
		return {
			root: root,
			type: eventType,
			callback: listener
		};
	},

	off: function (eventDetails) {
		eventDetails.root.removeEventListener(eventDetails.type, eventDetails.callback);
	}

};


lib.html = {

	parse: function (string) {
		var node = document.createElement("div"),
			frag = document.createDocumentFragment();
		node.innerHTML = string;
		while (node.hasChildNodes()) {
			frag.appendChild(node.firstChild);
		}
		return frag;
	}

};


lib.Template = new function () {

	function Template(template) {
		this.template = Array.join(template, "");
	}

	//example: new lib.Template("Hi, {NAME}").match({name: "John"}) → "Hi, John"
	Template.prototype.match = function (stringMap) {
		return Object.keys(stringMap).reduceRight(function (template, key) {
			return template.split("{" + key.toUpperCase() + "}").join(stringMap[key]);
		}, this.template);
	};

	return Template;

};


lib.I18n = new function () {

	//todo http://jaysoo.ca/2014/03/20/i18n-with-es6-template-strings/

	function I18n() {}

	I18n.prototype.use = function (params) {
		/*
			params = {
				locale: "ru-RU",
				defaultCurrency: 'RUR',
				messageBundle: {
					"english {0} template": "russian {0} template"
				}
			}
		*/
		return function () {};
	};

	return I18n;

};


lib.ajax = {

	//todo

	//returns promise
	get: function (url) {
		/*
			params = {
				method:   string,
				url:      string,
				data:     string|object,
				userName: string,
				password: string,
				timeout:  number,
				async:    boolean
			}
		*/
		return Promise.resolve(new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest;
			xhr.open("GET", url);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.onload = function () {
				resolve(xhr.responseText);
			};
			xhr.onerror = function () {
				reject(Error(xhr.statusText));
			};
			xhr.send();
		}));
	}

};
