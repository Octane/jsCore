/**
 * Обёртка коллекции элементов
 * @constructor
 * @extends $NodeList
 * @param {Element[]} list
 */
function $ElementList(list) {
	this.src = list;
}

$.ElementList = $Object.extend($ElementList, {

	isElementList: function () {
	}

});

$ElementList.prototype = $Object.extend(Object.create($NodeList.prototype), {

	constructor: $ElementList,

	each: function () {
	}

});
