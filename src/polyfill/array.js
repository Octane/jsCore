"use strict";

if (!Array.from) {
	Array.from = function (iterable, func, boundThis) {
		if (!Object(iterable).length) {
			return [];
		}
		if (func) {
			return Array.map(iterable, func, boundThis);
		}
		return Array.slice(iterable, 0);
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
		if (!(1 in arguments)) {
			startIndex = 0;
		}
		if (!(2 in arguments)) {
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
