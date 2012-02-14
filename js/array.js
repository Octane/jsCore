/**
 * Обёртка массива
 * @constructor
 * @extends $
 * @param {Array} array
 */
function $Array(array) {
	this.src = array;
}

$.Array = $Object.extend($Array, {

	isArray: Array.isArray,

	toArray: function () {
		return Array.prototype.slice.apply(list, arguments);
	}

});

$Array.prototype = $Object.extend(Object.create($.prototype), {

	constructor: $Array,

	count: function () {
		return this.src.length;
	},

	nth: function () {
	},

	odd: function () {
	},

	even: function () {
	},

	first: function () {
	},

	last: function () {
	},

	each: function () {
	}

});
