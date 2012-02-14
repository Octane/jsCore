/**
 * Обёртка коллекции узлов
 * @constructor
 * @extends $Array
 * @param {Node[]} list
 */
function $NodeList(list) {
	this.src = list;
}

$.NodeList = $Object.extend($NodeList, {

	isNodeList: function (list) {
	}

});

$NodeList.prototype = $Object.extend(Object.create($Array.prototype), {

	constructor: $NodeList,

	each: function () {
	}

});
