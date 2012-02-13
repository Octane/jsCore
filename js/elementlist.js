/**
 * Обёртка коллекции элементов
 * @constructor
 * @extends $NodeList
 * @param {Element[]} list
 */
function $ElementList(list) {
	this.src = list;
}

$.ElementList = $.extend($ElementList, {

	isElementList: function () {
	}

});

$ElementList.prototype = $.extend(Object.create($NodeList.prototype), {

	constructor: $ElementList,

	each: function () {
	}

});
