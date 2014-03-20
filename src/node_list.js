/**
 * Обёртка коллекции узлов
 * @constructor
 * @extends $List
 */
$.NodeList = function () {

	function $NodeList(nodes) {
		this.src = Array.from(nodes);
	}

	$($NodeList).extend($.ObjectList);

	Object.assign($NodeList.prototype, {

	});

	return $NodeList;

}();
