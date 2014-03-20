/**
 * Универсальная функция
 */
function $(arg) {
	var type = typeof arg;
	if (type == "function") {
		return new $.Function(arg);
	}
	return null;
}

Object.assign($, {

});

Object.assign($.prototype, {

	src: null,

	/**
	 * Конструкторы обёрток наследуют этот метод
	 * и помещают исходный объект в src
	 */
	source: function (src) {
		if (arguments.length) {
			this.src = src;
		}
		return this.src;
	}

});
