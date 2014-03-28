"use strict";

/**
 * for IE8 (can be removed if not needed, other fixes in a separate file)
 */
window.HTMLElement = window.HTMLElement || window.Element;
Window.prototype.addEventListener = Window.prototype.addEventListener || function (type, callback) {
	window.attachEvent("on" + type, callback);
};

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
			return Array(count + 1).join(this);
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
 * todo first run
 */
window.setImmediate = window.setImmediate || new function () {

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

	setImmediate.clearImmediate = function (id) {
		delete storage[message + id];
	};

	addEventListener("message", callback, false);

	return setImmediate;

};

window.clearImmediate = window.clearImmediate || setImmediate.clearImmediate;

/**
 * requestAnimationFrame polyfill
 */
window.requestAnimationFrame = [
	window.requestAnimationFrame,
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
	window.cancelAnimationFrame,
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
			//return this.children.length;
			//IE считает COMMENT_NODE
			var children = this.children, i = children.length, count = 0;
			while (i--) {
				if (children[i].nodeType == 1) {
					count++;
				}
			}
			return count;
		}

	};

	Object.keys(api).forEach(function (key) {
		Object.defineProperty(HTMLElement.prototype, key, {
			get: api[key]
		});
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
window.DOMStringMap = window.DOMStringMap || function () {};

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
			return fillDataset(new DOMStringMap, this.attributes);
		}
	});

};

/**
 * Promise polyfill
 */
window.Promise = window.Promise || new function () {

	var PENDING = 0,
		SETTED  = 1;

	function isSetted(promise) {
		return promise.state == SETTED;
	}

	function Promise(resolver) {
		if (typeof resolver != "function") {
			throw TypeError("Promise resolver is not a function");
		}
		if (Object(this).constructor !== Promise) {
			return new Promise(resolver);
		}
		this.resolver = resolver;
		this.state = PENDING;
	}

	Object.assign(Promise, {

		//todo thanable value support, fix IE8
		resolve: function (value) {
			if (Object(value).constructor === Promise) {
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
				var results = Array(promises.length);
				function tryResolve() {
					if (Array.every(promises, isSetted)) {
						resolve(results);
					}
				}
				Array.forEach(promises, function (promise, index) {
					promise.then(
						function (data) {
							results[index] = data;
							tryResolve();
						},
						reject
					);
				});
			});
		}

	});

	Object.assign(Promise.prototype, {

		then: function (onFulfilled, onRejected) {

			var promise = this, lastData;

			function nextResolve(data) {
				setImmediate(function () {
					if (promise.onFulfilled) {
						promise.onFulfilled(data);
					}
				});
			}

			function nextReject(error) {
				setImmediate(function () {
					if (promise.onRejected) {
						promise.onRejected(error);
					}
				});
			}

			function resolve(data) {
				setImmediate(function () {
					var crashed = false;
					lastData = data;
					if (promise.state == PENDING) {
						promise.state = SETTED;
						if (onFulfilled) {
							try {
								lastData = onFulfilled(data);
							}
							catch (error) {
								nextReject(error);
								crashed = true;
							}
						}
						if (!crashed) {
							nextResolve(lastData);
						}
					}
				});
			}

			function reject(error) {
				setImmediate(function () {
					var crashed = false;
					if (promise.state == PENDING) {
						promise.state = SETTED;
						if (onRejected) {
							try {
								onRejected(error);
							}
							catch (error) {
								nextReject(error);
								crashed = true;
							}
						}
						if (!crashed) {
							nextResolve(lastData);
						}
					}
				});
			}

			try {
				promise.resolver(resolve, reject);
			}
			catch (error) {
				if (promise.state == PENDING) {
					reject(error);
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

	return Promise;

};

Promise.prototype.catch_ = Promise.prototype["catch"];
