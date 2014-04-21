"use strict";

window.WeakSet || new function () {

	function WeakSet() {
		if (arguments.length) {
			//todo
			throw Error("WeakSet implementation doesn't accept parameters");
		}
		this.length = 0;
	}

	function equalValue(value) {
		//this → value
		return this === value;
	}

	function validValue(value) {
		if (Object(value) !== value) {
			throw TypeError("Invalid value used in weak set");
		}
		return value;
	}

	Object.assign(WeakSet.prototype, {

		add: function (value) {
			if (!this.has(validValue(value))) {
				Array.push(this, value);
			}
		},

		has: function (value) {
			return -1 != Array.findIndex(this, equalValue, validValue(value));
		},

		"delete": function (value) {
			var index = Array.findIndex(this, equalValue, validValue(value));
			if (-1 == index) {
				return false;
			}
			Array.splice(this, index, 1);
			return true;
		},

		clear: function () {
			Array.splice(this, 0, this.length);
		}

	});

	window.WeakSet = WeakSet;

};
