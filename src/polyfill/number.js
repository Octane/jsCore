"use strict";

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
