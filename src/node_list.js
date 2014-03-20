/**
 * Обёртка коллекции узлов
 * @constructor
 * @extends $List
 */
$.NodeList = function () {

	function $NodeList() {
		this.src = Array.apply(null, arguments);
	}

	$($NodeList).inherit($.List);

	Object.assign($NodeList.prototype, {

	});

	return $NodeList;

}();
