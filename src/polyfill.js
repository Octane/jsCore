"use strict";

/**
 * Language polyfill
 */
(function () {

		//На случай, если объект создан с помощью Object.create(null)
	var hasOwnProperty = Object.prototype.hasOwnProperty,

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
		forEach = Array.prototype.forEach || function (func, boundThis) {
			var i = 0, length = this.length;
			while (i < length) {
				if (i in this) {
					func.call(boundThis, this[i], i, this);
				}
				i++;
			}
		},

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
		getKeys = Object.keys || function (object) {
			var key, keys = [];
			if (Object(object) !== object) {
				throw TypeError("Object.keys called on non-object");
			}
			for (key in object) {
				if (hasOwnProperty.call(object, key)) {
					keys.push(key);
				}
			}
			return keys;
		};

	(function () {
		//в IE8 переопределенные стандартные методы не становятся enumerable
		var _getKeys = getKeys,
			hasBug = [
				"constructor", "toString", "toLocaleString", "valueOf",
				"hasOwnProperty", "propertyIsEnumerable", "isPrototypeOf"
			];
		if (!({toString: null}).propertyIsEnumerable("toString")) {
			getKeys = function (object) {
				var keys = _getKeys(object);
				forEach.call(hasBug, function (key) {
					if (hasOwnProperty.call(object, key)) {
						keys.push(key);
					}
				});
				return keys;
			};
		}
	}());

	function implement(object, properties) {
		forEach.call(getKeys(properties), function (key) {
			if (!object[key]) {
				object[key] = properties[key];
			}
		});
	}

	implement(Object, {

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
		keys: getKeys,

		//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
		assign: function (object, properties) {
			Object.keys(properties).forEach(function(key) {
				object[key] = properties[key];
			});
			return object;
		},

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
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

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
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

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
		forEach: forEach,

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
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

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
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

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
		lastIndexOf: function (anything) {
			var i = this.length;
			while (i--) {
				if (i in this && this[i] === anything) {
					return i;
				}
			}
			return -1;
		},

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
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

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
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

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
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

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
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

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduceRight
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

		//https://gist.github.com/rwldrn/5079436
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

		//https://gist.github.com/rwldrn/5079427
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

		//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.fill
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

	(function () {
		//в IE8 методы массива не работают с DOM-объектами
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
			slice.call(document.documentElement.childNodes);
		}
		catch (error) {
			Array.prototype.slice = function () {
				var iterable = this;
				//IE<9: Object(NodeList) instanceof Object → false
				if (!(Object(iterable) instanceof Object)) {
					iterable = toArray(iterable);
				}
				//IE<9: [1].slice(0, undefined) → []
				if (arguments.length > 1) {
					return slice.call(iterable, arguments[0], arguments[1]);
				}
				return slice.call(iterable, arguments[0] || 0);
			};
		}
	}());

	//https://developer.mozilla.org/ru/docs/JavaScript/Reference/Global_Objects/Array#Array_generic_methods
	[
		"concat",
		"every",
		"filter",
		"forEach",
		"fill",
		"indexOf",
		"join",
		"lastIndexOf",
		"map",
		"pop",
		"push",
		"reduce",
		"reduceRight",
		"reverse",
		"shift",
		"slice",
		"some",
		"sort",
		"splice",
		"unshift",
		"find",
		"findIndex"
	].forEach(function (methodName) {
		var method = Array.prototype[methodName];
		if (method && !Array[methodName]) {
			Array[methodName] = function (firstArgument) {
				switch (arguments.length) {
					case 1: return method.call(firstArgument);
					case 2: return method.call(firstArgument, arguments[1]);
					case 3: return method.call(firstArgument, arguments[1], arguments[2]);
				}
				return method.apply(firstArgument, Array.prototype.slice.call(arguments, 1));
			};
		}
	});

	implement(String.prototype, {

		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
		startsWith: function (string, position) {
			if (arguments.length == 1) {
				position = 0;
			}
			return this.indexOf(string, position) == position;
		},

		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
		endsWith: function (string, position) {
			var lastIndex;
			if (arguments.length == 1) {
				position = this.length;
			}
			position = position - string.length;
			lastIndex = this.lastIndexOf(string);
			return lastIndex != -1 && lastIndex == position;
		},

		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains
		contains: function (string) {
			return this.indexOf(string) != -1;
		},

		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
		repeat: function (count) {
			return Array(Number.toInteger(count) + 1).join(this);
		},

		trim: function () {
			//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
			//http://blog.stevenlevithan.com/archives/faster-trim-javascript
			//http://perfectionkills.com/chr-deviations/
			//взято из https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
			//http://perfectionkills.com/whitespace-deviations/
			var chr = "[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]",
				left = RegExp("^" + chr + chr + "*"), right = RegExp(chr + chr + "*$");
			return function () {
				return this.replace(left, "").replace(right, "");
			};

		}()

	});

	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_generic_methods
	[
		"startsWith",
		"endsWith",
		"contains",
		"repeat",
		"substring",
		"toLowerCase",
		"toUpperCase",
		"charAt",
		"charCodeAt",
		"indexOf",
		"lastIndexOf",
		"trim",
		"match",
		"search",
		"replace",
		"split",
		"substr",
		"concat",
		"slice"
	].forEach(function (methodName) {
		var method = String.prototype[methodName];
		if (method && !String[methodName]) {
			String[methodName] = function (firstArgument) {
				switch (arguments.length) {
					case 1: return method.call(firstArgument);
					case 2: return method.call(firstArgument, arguments[1]);
					case 3: return method.call(firstArgument, arguments[1], arguments[2]);
				}
				return method.apply(firstArgument, Array.prototype.slice.call(arguments, 1));
			};
		}
	});

	implement(Function.prototype, {

		//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
		bind: function () {
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
				var targetFunc = this, boundArgs = Array.prototype.slice.call(arguments, 1);
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
						allArgs = boundArgs.concat(Array.prototype.slice.call(arguments));
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
		}()

	});

	implement(Date, {

		now: function () {
			return + new Date;
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

}());

//IE8
var HTMLElement;
if (!HTMLElement) {
	HTMLElement = Element;
}

/**
 * Element traversal polyfill
 * http://www.w3.org/TR/ElementTraversal/
 */
(function () {

	if ("firstElementChild" in document.documentElement) {
		return false;
	}

	var api = {

		//https://developer.mozilla.org/En/DOM/Element.firstElementChild
		firstElementChild: function () {
			var node = this.firstChild;
			while (node && node.nodeType != 1) {
				node = node.nextSibling;
			}
			return node;
		},

		//https://developer.mozilla.org/En/DOM/Element.lastElementChild
		lastElementChild: function () {
			var node = this.lastChild;
			while (node && node.nodeType != 1) {
				node = node.previousSibling;
			}
			return node;
		},

		//https://developer.mozilla.org/En/DOM/Element.nextElementSibling
		nextElementSibling: function () {
			var node = this;
			do {
				node = node.nextSibling;
			}
			while(node && node.nodeType != 1);
			return node;
		},

		//https://developer.mozilla.org/En/DOM/Element.previousElementSibling
		previousElementSibling: function () {
			var node = this;
			do {
				node = node.previousSibling;
			}
			while(node && node.nodeType != 1);
			return node;
		},

		//https://developer.mozilla.org/En/DOM/Element.childElementCount
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

	return true;

}());

/**
 * IE8 event target polyfill
 */
(function () {

	if (window.addEventListener) {
		return false;
	}

	//асинхронный вызов функций, как setImmediate в IE10
	//todo setImmediate для всех браузеров
	//http://learn.javascript.ru/setimmediate
	//https://developer.mozilla.org/en-US/docs/Web/API/Window.setImmediate
	var id = 0, storage = {}, message = "EventTargetPolyfillMessage";

	function uid() {
		if (id == Number.MAX_SAFE_INTEGER) {
			id = 0;
		}
		else {
			id++;
		}
		return id;
	}

	window.attachEvent("onmessage", function () {
		var key = window.event.data, data;
		if (key.startsWith(message)) {
			data = storage[key];
			data.callback.call(data.target, data.event);
			delete storage[key];
		}
	});

	function callAsync(callback, element, event) {
		var key = message + Date.now() + uid();
		storage[key] = {
			event: event,
			target: element,
			callback: callback
		};
		postMessage(key, "*");
	}

/*
	// второй рабочий вариант на случай, если мешает флуд в message
	var callAsync = function () {
		var fakeNode = document.createElement("img"), storage = {}, id = 0;
		//fakeNode.src = "about:blank";
		fakeNode.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
		fakeNode.style.cssText = "position: absolute; top: -9999px; left: -9999px; width: 0; height: 0;";
		document.body.appendChild(fakeNode);
		fakeNode.attachEvent("onload", function () {
			var key = window.event.key, data = storage[key];
			data.callback.call(data.target, data.event);
			delete storage[key];
		});
		function uid() {
			if (id == Number.MAX_SAFE_INTEGER) {
				id = 0;
			}
			else {
				id++;
			}
			return id;
		}
		return function (callback, element, event) {
			var key = "call" + Date.now() + uid(), fakeEvent = document.createEventObject();
			storage[key] = {
				event: event,
				target: element,
				callback: callback
			};
			fakeEvent.key = key;
			fakeNode.fireEvent("onload", fakeEvent);
		};
	}();
*/

	function preventDefault() {
		this.returnValue = false;
	}

	function stopPropagation() {
		this.cancelBubble = true;
	}

	function saveAndFixEvent(event) {
		var clone = document.createEventObject(event);
		clone.target = clone.srcElement;
		//todo
		clone.pageX = clone.clientX + document.documentElement.scrollLeft;
		clone.pageY = clone.clientY + document.documentElement.scrollTop;
		clone.preventDefault = preventDefault;
		clone.stopPropagation = stopPropagation;
		return clone;
	}

	function createEventListener(callbacks, element) {
		return function () {
			var event = saveAndFixEvent(window.event), i = 0, length = callbacks.length;
			while (i < length) {
				callAsync(callbacks[i], element, event);
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

	function dispatchEvent(event) {
		this.fireEvent("on" + event.type, event);
	}

	[Window.prototype, HTMLDocument.prototype, HTMLElement.prototype, XMLHttpRequest.prototype].forEach(function (eventTarget) {
		eventTarget.addEventListener = addEventListener;
		eventTarget.removeEventListener = removeEventListener;
		eventTarget.dispatchEvent = dispatchEvent;
	});

	HTMLDocument.prototype.createEvent = function () {
		return Object.assign(document.createEventObject(), {
			initEvent: initEvent,
			initUIEvent: initUIEvent,
			initKeyEvent: initKeyEvent,
			initMouseEvent: initMouseEvent,
			initMutationEvent: initMutationEvent
		});
	};

	return true;

}());

/**
 * classList polyfill
 * todo InvalidCharacterError, IE11 several arguments support
 */
(function () {

	if ("classList" in document.documentElement) {
		return false;
	}

	function DOMTokenList(getTokens, onChange) {
		this.getTokens = getTokens;
		this.onChange = onChange;
		//this.push(getTokens());
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

		add: function (/*tokens*/) {
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

		remove: function (/*tokens*/) {
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
			//fix IE8
			element.addEventListener("propertychange", function (event) {
				if (event.propertyName == "className") {
					element._classList.update();
				}
			}, false);
*/
			element._classList.update();
			return element._classList;
		}
	});

	return true;

}());

/**
 * dataset polyfill
 */
(function () {

	if ("dataset" in document.documentElement) {
		return false;
	}

	var DOMStringMap;

	try {
		Object.defineProperty({}, "test", {});
		DOMStringMap = function () {};
	}
	catch (error) {
		DOMStringMap = function () {
			return document.createElement("dataset");
		};
	}

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

	return true;

}());
