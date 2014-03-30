"use strict";

Object.assign(lib, {

	//example: if (tests.every(lib.isTrue))
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
