"use strict";

window.WeakMap || new function () {

	var KEY = 0, VALUE = 1;

	function WeakMap(iterable/*or ...argumentsList*/) {
		if (iterable) {
			//todo
			//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-weakmap-objects
			//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
			//Iterable is an Array or other iterable object whose
			//elements are key-value pairs (2-element Arrays).
			//Each key-value pair will be added to the new Map.
		}
	}

	function equalKey(pair) {
		//this → key
		return this === pair[KEY];
	}

	function validKey(key) {
		if (Object(key) !== key) {
			throw TypeError("Invalid value used as weak map key");
		}
		return key;
	}

	Object.assign(WeakMap.prototype, {

		length: 0,

		_getPair: function (key) {
			return Array.find(this, equalKey, validKey(key));
		},

		set: function (key, value) {
			var pair = this._getPair(key);
			if (pair) {
				pair[VALUE] = value;
			}
			else {
				//todo use Map
				Array.push(this, [key, value]);
			}
		},

		get: function (key) {
			return Object(this._getPair(key))[VALUE];
		},

		has: function (key) {
			return Boolean(this._getPair(key));
		},

		"delete": function (key) {
			var index = Array.findIndex(this, equalKey, validKey(key));
			return -1 != index && Boolean(Array.splice(this, index, 1));
		},

		clear: function () {
			Array.splice(this, 0, this.length);
		}

	});

	window.WeakMap = WeakMap;

};

WeakMap.prototype.delete_ = WeakMap.prototype["delete"];
