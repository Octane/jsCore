"use strict";﻿

/**
 * for IE8 (can be removed if not needed, other fixes in a separate file)
 */
if (!window.HTMLElement) {
	window.HTMLElement = window.Element;
}
if (!Window.prototype.addEventListener) {
	Window.prototype.addEventListener = function (type, callback) {
		window.attachEvent("on" + type, callback);
	};
}

/**
 * Language polyfill
 */
new function () {

	function implement(object, properties) {
		var key;
		for (key in properties) {
			if (!(key in object)) {
				object[key] = properties[key];
			}
		}
	}

	function fastApply(method, args) {
		switch (args.length) {
			case 1: return method.call(args[0]);
			case 2: return method.call(args[0], args[1]);
			case 3: return method.call(args[0], args[1], args[2]);
		}
		return method.apply(args[0], Array.prototype.slice.call(args, 1));
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

	implement(Object, {

		keys: function (object) {
			var i = 0, key, keys = [];
			if (Object(object) !== object) {
				throw TypeError("Object.keys called on non-object");
			}
			for (key in object) {
				if (Object.hasOwnProperty.call(object, key)) {
					keys[i++] = key;
				}
			}
			return keys;
		},

		//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
		assign: function (object, properties) {
			var i = 0, key, keys = Object.keys(properties), length = keys.length;
			while (i < length) {
				key = keys[i];
				object[key] = properties[key];
				i++;
			}
			return object;
		},

		create: function (prototype) {
			if (arguments.length > 1) {
				throw Error("Object.create implementation only accepts the first parameter");
			}
			function NOP() {}
			NOP.prototype = prototype;
			return new NOP();
		}

	});

	implement(Array, {

		isArray: function (anything) {
			return Object.prototype.toString.call(anything) == "[object Array]";
		},

		//http://wiki.ecmascript.org/doku.php?id=strawman:array_extras
		from: function (iterable) {
			if (arguments.length > 1) {
				//todo map
				throw Error("Array.from implementation only accepts the first parameter");
			}
			return Object(iterable).length ? Array.slice(iterable, 0) : [];
		},

		//http://wiki.ecmascript.org/doku.php?id=strawman:array_extras
		of: function () {
			return Array.from(arguments);
		}

	});

	implement(Array.prototype, {

		forEach: function (func, boundThis) {
			var i = 0, length = this.length;
			while (i < length) {
				if (i in this) {
					func.call(boundThis, this[i], i, this);
				}
				i++;
			}
		},

		map: function (func, boundThis) {
			var i = 0, length = this.length, result = [];
			while (i < length) {
				if (i in this) {
					result[i] = func.call(boundThis, this[i], i, this);
				}
				i++;
			}
			return result;
		},

		indexOf: function (anything) {
			var i = 0, length = this.length;
			while (i < length) {
				if (i in this && this[i] === anything) {
					return i;
				}
				i++;
			}
			return -1;
		},

		lastIndexOf: function (anything) {
			var i = this.length;
			while (i--) {
				if (i in this && this[i] === anything) {
					return i;
				}
			}
			return -1;
		},

		filter: function (func, boundThis) {
			var i = 0, length = this.length, result = [];
			while (i < length) {
				if (i in this && func.call(boundThis, this[i], i, this)) {
					result.push(this[i]);
				}
				i++;
			}
			return result;
		},

		every: function (func, boundThis) {
			var i = 0, length = this.length;
			while (i < length) {
				if (i in this && !func.call(boundThis, this[i], i, this)) {
					return false;
				}
				i++;
			}
			return true;
		},

		some: function (func, boundThis) {
			var i = 0, length = this.length;
			while (i < length) {
				if (i in this && func.call(boundThis, this[i], i, this)) {
					return true;
				}
				i++;
			}
			return false;
		},

		reduce: function (func, initialValue) {
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
		},

		reduceRight: function (func, initialValue) {
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
		},

		find: function (func, boundThis) {
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
		},

		findIndex: function (func, boundThis) {
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
		},

		fill: function (value, start, end) {
			var i, length = this.length;
			if (typeof start == "undefined") {
				start = 0;
			}
			if (typeof end == "undefined") {
				end = length;
			}
			if (start < 0) {
				i = Math.max(length + start, 0);
			}
			else {
				i = Math.min(start, length);
			}
			while (i < length && i < end) {
				this[i] = value;
				i++;
			}
			return this;
		}

	});

	implement(Array, createGenerics(Array.prototype, [
		"concat", "every", "fill", "filter", "find",
		"findIndex", "forEach", "indexOf", "join",
		"lastIndexOf", "map", "pop", "push", "reduce",
		"reduceRight", "reverse", "shift", "slice",
		"some", "sort", "splice", "unshift"
	]));

	implement(String.prototype, {

		startsWith: function (string, position) {
			if (arguments.length == 1) {
				position = 0;
			}
			return this.indexOf(string, position) == position;
		},

		endsWith: function (string, position) {
			var lastIndex;
			if (arguments.length == 1) {
				position = this.length;
			}
			position = position - string.length;
			lastIndex = this.lastIndexOf(string);
			return lastIndex != -1 && lastIndex == position;
		},

		contains: function (string, position) {
			return this.indexOf(string, position) != -1;
		},

		repeat: function (count) {
			return new Array(count + 1).join(this);
		},

		trim: new function () {
			//http://perfectionkills.com/chr-deviations/
			//https://github.com/kriskowal/es5-shim/
			var whitespace = "[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]",
				//http://blog.stevenlevithan.com/archives/faster-trim-javascript/
				left = RegExp("^" + whitespace + whitespace + "*"),
				right = RegExp(whitespace + whitespace + "*$");
			return function () {
				return this.replace(left, "").replace(right, "");
			};
		}

	});

	implement(String, createGenerics(String.prototype, [
		"charAt", "charCodeAt", "concat", "contains","endsWith",
		"indexOf", "lastIndexOf", "match", "repeat", "replace",
		"search", "slice", "split", "startsWith", "substr",
		"substring", "toLowerCase", "toUpperCase", "trim"
	]));

	implement(Function.prototype, {

		bind: new function () {

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
					//в strict режиме this может быть undefined
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

		}

	});

	implement(Date, {

		now: function () {
			return (new Date).getTime();
		}

	});

	implement(Number, {

		MAX_SAFE_INTEGER: 9007199254740991,

		isFinite: function (value) {
            return typeof value == "number" && isFinite(value);
        },

        isInteger: function (value) {
			return typeof value == "number" && isFinite(value) && value > -9007199254740992 && value < 9007199254740992 && Math.floor(value) == value;
        },

        isNaN: function (value) {
        	return typeof value == "number" && isNaN(value);
        },

        toInteger: function (value) {
			var number = +value;
			if (isNaN(number)) {
				return +0;
			}
			if (number === 0 || !isFinite(number)) {
				return number;
			}
			return (number < 0 ? -1 : 1) * Math.floor(Math.abs(number));
        }

	});

};

/**
 * setImmediate polyfill
 */
window.setImmediate || new function () {

	var id = 0, storage = {}, message = "setImmediatePolyfillMessage";

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
		event = event || window.event;
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
		postMessage(key, "*");
		return id;
	}

	function clearImmediate(id) {
		delete storage[message + id];
	}

	addEventListener("message", callback, false);

	window.setImmediate = setImmediate;
	window.clearImmediate = setImmediate;

};

/**
 * requestAnimationFrame polyfill
 */
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


/**
 * Element traversal polyfill
 */
"firstElementChild" in document.documentElement || new function () {

	var api = {

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
		}

	};

	[HTMLDocument, HTMLElement].forEach(function (Constructor) {
		Object.keys(api).forEach(function (key) {
			Object.defineProperty(Constructor.prototype, key, {
				get: api[key]
			});
		});
	});

};

/**
 * Element traversal polyfill (children)
 */
"children" in document.createDocumentFragment() || new function () {

	var ELEMENT_NODE = 1;

	function StaticHTMLCollection() {}

	StaticHTMLCollection.prototype.item = function (index) {
		return this[index] || null;
	};

	Object.defineProperty((window.DocumentFragment || window.HTMLDocument).prototype, "children", {
		get: function () {
			var i = 0, node, nodes = this.childNodes, length = nodes.length,
				j = 0, elements = new StaticHTMLCollection;
			while (i < length) {
				node = nodes[i];
				if (node.nodeType == ELEMENT_NODE) {
					elements[j++] = node;
				}
				i++;
			}
			elements.length = j;
			return elements;
		}
	});

};

/**
 * classList polyfill
 * todo InvalidCharacterError, IE11 several arguments support
 */
"classList" in document.documentElement || new function () {

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
			return this[index];
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

		contains: function () {
			this.update();
			return !Array.find(arguments, function (token) {
				return Array.indexOf(this, token) == -1;
			}, this);
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
						element.className = Array.join(this, " ");
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

/**
 * dataset polyfill
 * simple implementation: the new property will not create an attribute
 */
function StaticDOMStringMap() {}
"dataset" in document.documentElement || new function () {

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

/**
 * matches polyfill
 */
HTMLElement.prototype.matches || new function () {

	var ELEMENT_NODE = 1, proto = HTMLElement.prototype;

	function isContains(root, element, selector) {
		return Array.indexOf(root.querySelectorAll(selector), element) != -1;
	}

	function matches(selector) {
		var root = this.parentNode, contains;
		if (root) {
			if (root.nodeType == ELEMENT_NODE) {
				root = root.ownerDocument;
			}
			return isContains(root, this, selector);
		}
		root = document.createDocumentFragment();
		root.appendChild(this);
		contains = isContains(root, this, selector);
		root.removeChild(this);
		return contains;
	}

	proto.matches = [
		proto.matchesSelector,
		proto.oMatchesSelector,
		proto.msMatchesSelector,
		proto.mozMatchesSelector,
		proto.webkitMatchesSelector,
		matches
	].find(Boolean);

};

/**
 * Promise polyfill
 */
window.Promise || new function () {

	var PENDING = 0, SETTED  = 1;

	function isPromise(anything) {
		return anything instanceof Promise;
	}

	function isSetted(promise) {
		return promise.state == SETTED;
	}

	function allSetted(promises) {
		return Array.every(promises, isSetted);
	}

	function Promise(resolver) {
		if (typeof resolver != "function") {
			throw TypeError("Promise resolver is not a function");
		}
		if (!isPromise(this)) {
			return new Promise(resolver);
		}
		this.resolver = resolver;
		this.state = PENDING;
	}

	Object.assign(Promise, {

		//todo thenable value support
		resolve: function (value) {
			if (isPromise(value)) {
				return value;
			}
			return new Promise(function (resolve) {
				resolve(value);
			});
		},

		reject: function (reason) {
			return new Promise(function (resolve, reject) {
				reject(reason);
			});
		},

		//not implemented in native Promise
		//cast: function () {},

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
							if (allSetted(promises)) {
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

		then: function (onFulfilled, onRejected) {

			var promise = this, lastValue;

			function nextResolve(value) {
				setImmediate(function () {
					if (promise.onFulfilled) {
						promise.onFulfilled(value);
					}
				});
			}

			function nextReject(reason) {
				setImmediate(function () {
					if (promise.onRejected) {
						promise.onRejected(reason);
					}
				});
			}

			function resolve(value) {
				setImmediate(function () {
					var crashed;
					lastValue = value;
					if (promise.state == PENDING) {
						promise.state = SETTED;
						if (onFulfilled) {
							try {
								lastValue = onFulfilled(value);
							}
							catch (reason) {
								crashed = true;
								nextReject(reason);
							}
						}
						if (!crashed) {
							nextResolve(lastValue);
						}
					}
				});
			}

			function reject(reason) {
				setImmediate(function () {
					var crashed;
					if (promise.state == PENDING) {
						promise.state = SETTED;
						if (onRejected) {
							try {
								onRejected(reason);
							}
							catch (reason) {
								crashed = true;
								nextReject(reason);

							}
						}
						if (!crashed) {
							nextResolve(lastValue);
						}
					}
				});
			}

			try {
				promise.resolver(resolve, reject);
			}
			catch (reason) {
				if (promise.state == PENDING) {
					reject(reason);
				}
			}

			return new Promise(function (resolve, reject) {
				promise.onFulfilled = resolve;
				promise.onRejected = reject;
			});

		},

		"catch": function (onRejected) {
			return this.then(undefined, onRejected);
		}

	});

	window.Promise = Promise;

};

Promise.prototype.catch_ = Promise.prototype["catch"];
/**
 * IE8 dataset fix
 */
try {
	Object.defineProperty({}, "test", {});
}
catch (error) {
	StaticDOMStringMap = function () {
		return document.createElement("dataset");
	};
}

/**
 * IE8 Object.keys fix
 */
({toString: null}).propertyIsEnumerable("toString") || new function () {

	//в IE8 переопределенные стандартные методы не становятся enumerable
	var objectKeys = Object.keys, hasBug = [
			"constructor", "toString", "toLocaleString", "valueOf",
			"hasOwnProperty", "propertyIsEnumerable", "isPrototypeOf"
		];

	Object.keys = function (object) {
		var i = hasBug.length, key, keys = objectKeys(object), j = keys.length;
		while (i--) {
			key = hasBug[i];
			if (Object.hasOwnProperty.call(object, key)) {
				keys[j++] = key;
			}
		}
		return keys;
	};

};

/**
 * IE8 Array.slice fix
 */
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

/**
 * IE8 event target polyfill
 */
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
			if (event) {
				//custom event
				event.target = element;
			}
			else {
				event = fixEvent(window.event);
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

/**
 * IE8 getComputedStyle polyfill
 */
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

/**
 * IE8 textContent polyfill
 */
"textContent" in document.documentElement || Object.defineProperty(HTMLElement.prototype, "textContent", {
	get: function () {
		return this.innerText;
	},
	set: function (value) {
		this.innerText = value;
	}
});

/**
 * IE8 children fix
 */
(function () {

	var node = document.createElement("div");
	node.appendChild(document.createComment("test"));
	return node.children.length;

}()) && new function () {

	Object.defineProperty(HTMLElement.prototype, "children", {
		get: Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "children").get
	});

};

/**
 * IE8 XHMLHttpRequest events polyfill
 */
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


/**
 * jsCore JavaScript library v0.1
 * Copyright 2014, Dmitry Korobkin
 * Released under the MIT License
 */
var lib = {};


Object.assign(lib, {

	//example: if ([test1(), test2()].every(lib.isTrue))
	isTrue: function (arg) {
		return bool === true;
	},

	isFalse: function (arg) {
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
	every: function (iterable, func, boundThis) {
		var i = Object(iterable).length;
		if (!i) {
			return false;
		}
		while (i--) {
			if (i in iterable) {
				if (func.call(boundThis, iterable[i]) === false) {
					return false;
				}
			}
			else {
				return false;
			}
		}
		return true;
	}

};


lib.event = {

	//example: element.addEventListener("click", lib.event.preventDefault, false)
	preventDefault: function (event) {
		event.preventDefault();
	},

	stopPropagation: function (event) {
		event.stopPropagation();
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
		return new Promise(function (resolve, reject) {
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
		});
	}

};
