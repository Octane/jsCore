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

	isArray: Array.isArray

});

$Array.prototype = $Object.extend(Object.create($.prototype), {

	constructor: $Array,

	count: function () {
		//подсчет реального количсества элементов
		//http://javascript.ru/forum/misc/25392-rabota-s-massivom.html#post155335
		return this.src.reduce(function (length) {
			return length + 1;
		}, 0);
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
