/**
 * Обёртка коллекции элементов
 * @constructor
 * @extends $NodeList
 */
$.ElementList = function () {

	function $ElementList() {
		this.src = Array.apply(null, arguments);
	}

	$($ElementList).inherit($.NodeList);


	Object.assign($ElementList.prototype, {

	});

	return $ElementList;

}();
