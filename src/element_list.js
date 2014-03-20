/**
 * Обёртка коллекции элементов
 * @constructor
 * @extends $NodeList
 */
$.ElementList = function () {

	function $ElementList(elements) {
		this.src = Array.from(elements);
	}

	$($ElementList).extend($.NodeList);


	Object.assign($ElementList.prototype, {

	});

	return $ElementList;

}();
