/**
 * Обёртка коллекции узлов
 * @constructor
 * @extends $Array
 * @param {Node[]} list
 */
function $NodeList(list) {
	this.src = list;
}

$.NodeList = $.extend($NodeList, {

	isNodeList: function (list) {
	}

});

$NodeList.prototype = $.extend(Object.create($Array.prototype), {

	constructor: $NodeList,

	each: function () {
	}

});
