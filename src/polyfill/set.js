"use strict";

var Set;

Set || (Set = new function () {

	function Set() {
		if (arguments.length) {
			//todo
			throw Error("Set implementation doesn't accept parameters");
		}
		this.length = 0;
	}

	Object.assign(Set.prototype, {

		size: 0,

		add: function (value) {
			if (!this.has(value)) {
				this.size = Array.push(this, value);
			}
		},

		has: function (value) {
			return -1 != Array.findIndex(this, function (val) {
				return Object.is(value, val);
			});
		},

		"delete": function (value) {
			var index = Array.findIndex(this, function (val) {
				return Object.is(value, val);
			});
			if (-1 == index) {
				return false;
			}
			Array.splice(this, index, 1);
			this.size--;
			return true;
		},

		clear: function () {
			Array.splice(this, 0, this.length);
			this.size = 0;
		}

		//todo forEach, entries, keys, values

	});

	return Set;

});
