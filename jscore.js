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

	/*@cc_on
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
	@*/

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

	//в IE8 методы массива не работают с DOM-объектами
	/*@cc_on
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
		slice.call(document.createElement("div").childNodes);
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
	@*/

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

/**
 * Element traversal polyfill
 * http://www.w3.org/TR/ElementTraversal/
 */
(function () {

	var proto, api = {

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

		//https://developer.mozilla.org/En/DOM/Element.children

	};

	if ("firstElementChild" in document.createElement("div")) {
		return false;
	}

	if (typeof HTMLElement != "undefined") {
		proto = HTMLElement.prototype;
	}
	else if (typeof Element != "undefined") {
		proto = Element.prototype;
	}
	else {
		throw new ReferenceError("HTMLElement is not defined");
	}

	if (Object.defineProperty) {
		Object.keys(api).forEach(function (key) {
			Object.defineProperty(proto, key, {
				get: api[key]
			});
		});
	}
	else if (proto.__defineGetter__) {
		Object.keys(api).forEach(function (key) {
			proto.__defineGetter__(key, api[key]);
		});
	}
	else {
		throw new Error("Getters are not supported");
	}

	return true;

}());

/**
 * IE8 event target polyfill
 */
(function () {

	if (window.addEventListener) {
		return false;
	}

	if (typeof Element == "undefined") {
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

	attachEvent("onmessage", function () {
		var key = event.data, data;
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
			var key = event.key, data = storage[key];
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

	[window, document, Element.prototype, XMLHttpRequest.prototype].forEach(function (eventTarget) {
		eventTarget.addEventListener = addEventListener;
		eventTarget.removeEventListener = removeEventListener;
		eventTarget.dispatchEvent = dispatchEvent;
	});

	document.createEvent = function () {
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
﻿/*
jsCore JavaScript library v0.1
Copyright 2014, Dmitry Korobkin
Released under the MIT License.
*/
var $ = function () {
﻿/**
 * Универсальная функция
 */
function $(arg) {
	var type = typeof arg;
	if (type == "function") {
		return new $.Function(arg);
	}
	return null;
}

Object.assign($, {

});

Object.assign($.prototype, {

	src: null,

	/**
	 * Конструкторы обёрток наследуют этот метод
	 * и помещают исходный объект в src
	 */
	source: function (src) {
		if (arguments.length) {
			this.src = src;
		}
		return this.src;
	}

});
﻿/**
 * Обёртка функции
 * @constructor
 * @extends $
 */
$.Function = function () {

	function $Function(func) {
		this.src = func;
	}

	$Function.prototype = Object.assign(Object.create($.prototype), {

		constructor: $Function,

		inherit: function (Parent) {
			var Func = this.src, proto = Func.prototype;
			proto = Object.create(Parent.prototype);
			proto.constructor = Func;
			return this;
		}

	});

	return $Function;

}();
/**
 * …
 * @constructor
 * @extends …
 * @param {…} …
 */
$.EventTarget = function () {

	function $EventTarget(object) {
		this.src = object;
	}

	Object.assign($EventTarget.prototype, {

		on: function (eventType, listener) {
			$console.error("$EventTarget.prototype.on not implemented");
			return this;
		},

		fire: function (eventType, data) {
			$console.error("$EventTarget.prototype.fire not implemented");
			return this;
		}

	});

	return $EventTarget;

}();
﻿/**
 * Обёртка объекта
 * @constructor
 * @extends $
 * @param {Object} obj
 */
$.Object = function () {

	function $Object(obj) {
		this.src = obj;
	}

	$($Object).inherit($);

	Object.assign($Object.prototype, {

		/**
		 * Общий интерфейс для get-set методов (prop, attr и др.),
		 * поведение зависит от args:
		 * ["key"]                    → get("key")
		 * [["key1", "key2"]]         → {key1: get("key1"), key2: get("key2")}
		 * ["key", val]               — set("key", val)
		 * [{key1: val1, key2: val2}] — set("key1", val1), set("key2", val2)
		 * @param {String} $get название get-метода (getProp, getAttr и др.)
		 * @param {String} $set название set-метода (setProp, setAttr и др.)
		 * @param {Arguments} args объект аргументов функции
		 * @return {Mixed}
		 */
		_getOrSet: function ($get, $set, args) {
			var i, key, keys, obj, arg = args[0];
			//$(…).prop("x", 1)
			if (args.length == 2) {
				return this[$set](arg, args[1]);
			}
			//$(…).prop("x")
			if (typeof arg == "string") {
				return this[$get](arg);
			}
			//$(…).prop(["x", "y"])
			if (Array.isArray(arg)) {
				obj = {};
				i = arg.length;
				while (i--) {
					key = arg[i];
					obj[key] = this[$get](key);
				}
				return obj;
			}
			//$(…).prop({x: 1, y: 2})
			keys = Object.keys(arg);
			i = keys.length;
			while (i--) {
				key = keys[i];
				this[$set](key, arg[key]);
			}
			return this;
		},

		is: function (arg) {
			if (typeof arg == "function") {
				return Boolean(arg(this.src));
			}
			return false;
		},

		not: function (arg) {
			return !this.is(arg);
		},

		hasProp: function (name) {
			return name in this.src;
		},

		delProp: function (name) {
			delete this.src[name];
			return this;
		},

		setProp: function (name, val) {
			this.src[name] = val;
			return this;
		},

		getProp: function (name) {
			return this.src[name];
		},

		/**
		 * Возвращает или устанавливает значения свойств
		 * $(obj).prop("x")          → obj.x
		 * $(obj).prop(["x", "y"])   → {x: obj.x, y: obj.y}
		 * $(obj).prop("x", 1)       — obj.x = 1
		 * $(obj).prop({x: 1, y: 2}) — obj.x = 1, obj.y = 2
		 */
		prop: function () {
			return this._getOrSet("getProp", "setProp", arguments);
		}

	});

	return $Object;

}();
﻿/**
 * Обёртка узла
 * @constructor
 * @extends $Object
 */
$.Node = function () {

	function $Node(node) {
		this.src = node;
	}

	$($Node).inherit($.Object);

	Object.assign($Node.prototype, {

		is: function (anything) {
			//todo другие типы arg
			if (typeof anything == "string") {
				return this.src.nodeValue == anything;
			}
			return $.Object.prototype.is.call(this, anything);
		},

		parent: function () {
		},

		ancestor: function () {
		},

		appendTo: function () {
		},

		prependTo: function () {
		},

		insAfter: function () {
		},

		insBefore: function () {
		},

		wrap: function () {
		},

		remove: function () {
		},

		clone: function () {
		},

		toList: function () {
		}

	});

	return $Node;

}();
﻿/**
 * Обёртка элемента
 * @constructor
 * @extends $Node
 */
$.Element = function () {

	function $Element(element) {
		this.src = element;
	}

	$($Element).inherit($.Node);

	Object.assign($Element.prototype, {

		is: function (arg) {
			//todo другие типы arg
			if (typeof arg == "string") {
				return this.isEqToSel(arg);
			}
			return $Object.prototype.is.call(this, arg);
		},

		_isEqToSel: function (sel) {
			//todo implement matchesSelector
			var i, name, names, attr, val, attrs, el = this.src, comp = $.selector.comparison;
			if ("id" in sel && sel.id != el.id) {
				return false;
			}
			if ("tag" in sel && sel.tag != el.tagName.toLowerCase()) {
				return false;
			}
			if (sel.attrs) {
				names = sel.attrNames;
				attrs = this.attr(names);
				i = names.length;
				while (i--) {
					name = names[i];
					val  = attrs[name];
					attr = sel.attrs[name];
					if (val === null || ("value" in attr && !comp[attr.comparison](val, attr.value))) {
						return false;
					}
				}
			}
			if (sel.classes) {
				return this.hasClass(sel.classes);
			}
			return true;
		},

		/**
		 * Сравнивает элемент с селектором
		 * @param {String} sel
		 * @return {Boolean}
		 */
		isEqToSel: function (sel) {
			sel = $.selector.apart(sel);
			var i = sel.length;
			while (i--) {
				if (!this._isEqToSel(sel[i])) {
					return false;
				}
			}
			return true;
		},

		after: function () {
		},

		before: function () {
		},

		next: function () {
		},

		prev: function () {
		},

		first: function () {
		},

		last: function () {
		},

		children: function () {
		},

		descendant: function (sel) {
		},

		descendants: function () {
		},

		append: function () {
		},

		prepend: function () {
		},

		empty: function () {
		},

		hasAttr: function () {
		},

		delAttr: function (name) {
			this.src.removeAttr(name);
			return this;
		},

		setAttr: function (name, val) {
			this.src.setAttribute(name, String(val));
			return this;
		},

		getAttr: function (name) {
			var val = this.src.getAttribute(name);
			return val === null ? null : String(val);
		},

		attr: function () {
			return this._getOrSet("getAttr", "setAttr", arguments);
		},

		hasData: function () {
		},

		delData: function () {
		},

		setData: function () {
			//todo сделать преобразование ключей по стандарту,
			//по возможности использовать встроенный интерфейс
			//https://developer.mozilla.org/en/DOM/element.dataset
			//http://www.w3.org/TR/html5/elements.html#dom-dataset
		},

		getData: function () {
		},

		data: function () {
			return this._getOrSet("getData", "setData", arguments);
		},

		setCSSProp: function () {
		},

		getCSSProp: function () {
		},

		css: function () {
		},

		hasClass: function () {
		},

		delClass: function () {
		},

		addClass: function () {
		},

		toggleClass: function () {
		},

		classes: function () {
		},

		animate: function () {
			//requestAnimationFrame
			//http://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
			//http://habrahabr.ru/company/microsoft/blog/137705/
			//http://jsfiddle.net/paul/XQpzU/
			/*window.requestAnimFrame = (function() {
				return
					window.requestAnimationFrame ||
					window.msRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					(function(callback) { window.setTimeout(callback, 1000 / 60); });
			})();*/
		},

		subscribe: function (evType, func, useCapturing) {
		},

		toList: function () {
			return new $.ElementList([this.src]);
		}

	});

	return $Element;

}();
﻿/**
 * Обёртка массива
 * @constructor
 * @extends $
 */
$.List = function () {

	function $List() {
		this.src = Array.apply(null, arguments);
	}

	$($List).inherit($);

	Object.assign($List, {

		from: function (iterable) {
			return (new this).source(Array.from(iterable));
		},

		of: function () {
			return this.from(arguments);
		},

		concat: function () {
			return this.from(Array.concat.apply(Array, arguments));
		},

		every: function () {
			throw new Error("$List.every not implemented");
		},

		filter: function () {
			throw new Error("$List.filter not implemented");
		},

		forEach: function () {
			throw new Error("$List.forEach not implemented");
		},

		indexOf: function () {
			throw new Error("$List.indexOf not implemented");
		},

		join: function () {
			throw new Error("$List.join not implemented");
		},

		lastIndexOf: function () {
			throw new Error("$List.lastIndexOf not implemented");
		},

		map: function () {
			throw new Error("$List.map not implemented");
		},

		pop: function () {
			throw new Error("$List.pop not implemented");
		},

		push: function () {
			throw new Error("$List.push not implemented");
		},

		reduce: function () {
			throw new Error("$List.reduce not implemented");
		},

		reduceRight: function () {
			throw new Error("$List.reduceRight not implemented");
		},

		reverse: function () {
			throw new Error("$List.reverse not implemented");
		},

		shift: function () {
			throw new Error("$List.shift not implemented");
		},

		slice: function () {
			throw new Error("$List.slice not implemented");
		},

		some: function () {
			throw new Error("$List.some not implemented");
		},

		sort: function () {
			throw new Error("$List.sort not implemented");
		},

		splice: function () {
			throw new Error("$List.splice not implemented");
		},

		unshift: function () {
			throw new Error("$List.unshift not implemented");
		},

		find: function () {
			throw new Error("$List.find not implemented");
		},

		findIndex: function () {
			throw new Error("$List.findIndex not implemented");
		}

	});

	Object.assign($List.prototype, {

		count: function () {
			//подсчет реального количсества элементов
			//http://javascript.ru/forum/misc/25392-rabota-s-massivom.html#post155335
			return this.src.reduce(function (length) {
				return length + 1;
			}, 0);
		},

		nth: function (i) {
			return $(this.src[i]);
		},

		first: function () {
			var array = this.src, length = array.length, i = 0;
			while (i < length) {
				if (i in array) {
					return $(array[i]);
				}
				i++;
			}
			return null;
		},

		last: function () {
			var array = this.src, i = array.length;
			while (i--) {
				if (i in array) {
					return $(array[i]);
				}
			}
			return null;
		},

		concat: function () {
			throw new Error("$List.prototype.concat not implemented");
		},

		every: function () {
			throw new Error("$List.prototype.every not implemented");
		},

		filter: function (func, boundThis) {
			return this.constructor.from(this.src.filter(func, boundThis));
		},

		forEach: function (func, boundThis) {
			this.src.forEach(func, boundThis);
			return this;
		},

		indexOf: function () {
			throw new Error("$List.prototype.indexOf not implemented");
		},

		join: function () {
			throw new Error("$List.prototype.join not implemented");
		},

		lastIndexOf: function () {
			throw new Error("$List.prototype.lastIndexOf not implemented");
		},

		map: function () {
			throw new Error("$List.prototype.map not implemented");
		},

		pop: function () {
			throw new Error("$List.prototype.pop not implemented");
		},

		push: function () {
			throw new Error("$List.prototype.push not implemented");
		},

		reduce: function () {
			throw new Error("$List.prototype.reduce not implemented");
		},

		reduceRight: function () {
			throw new Error("$List.prototype.reduceRight not implemented");
		},

		reverse: function () {
			throw new Error("$List.prototype.reverse not implemented");
		},

		shift: function () {
			throw new Error("$List.prototype.shift not implemented");
		},

		slice: function () {
			throw new Error("$List.prototype.slice not implemented");
		},

		some: function () {
			throw new Error("$List.prototype.some not implemented");
		},

		sort: function () {
			throw new Error("$List.prototype.sort not implemented");
		},

		splice: function () {
			throw new Error("$List.prototype.splice not implemented");
		},

		unshift: function () {
			throw new Error("$List.prototype.unshift not implemented");
		},

		find: function () {
			throw new Error("$List.prototype.find not implemented");
		},

		findIndex: function () {
			throw new Error("$List.prototype.findIndex not implemented");
		},

		each: function (method) {
			var array = this.src, i, length, arg1, rest, $wrap;
			if (typeof method == "function") {
				return this.forEach(method, arguments[1]);
			}
			i = 0;
			length = array.length;
			switch (arguments.length) {
				case 1:
					while (i < length) {
						if (i in array) {
							$(array[i])[method]();
						}
						i++;
					}
					break;
				case 2:
					arg1 = arguments[1];
					while (i < length) {
						if (i in array) {
							$(array[i])[method](arg1);
						}
						i++;
					}
					break;
				default:
					rest = Array.slice(arguments, 1);
					while (i < length) {
						if (i in array) {
							$wrap = $(array[i]);
							$wrap[method].apply($wrap, rest);
						}
						i++;
					}
			}
			return this;
		},

		toArray: function () {
			return this.src;
		}

	});

	return $List;

}();
﻿/**
 * Обёртка коллекции узлов
 * @constructor
 * @extends $List
 */
$.NodeList = function () {

	function $NodeList() {
		this.src = Array.apply(null, arguments);
	}

	$($NodeList).inherit($.List);

	Object.assign($NodeList.prototype, {

	});

	return $NodeList;

}();
﻿/**
 * Обёртка коллекции элементов
 * @constructor
 * @extends $NodeList
 */
$.ElementList = function () {

	function $ElementList() {
		this.src = Array.apply(null, arguments);
	}

	$($ElementList).inherit($.NodeList);


	Object.assign($ElementList.prototype, {

	});

	return $ElementList;

}();

	return $;

}();
