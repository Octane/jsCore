/**
 * Обёртка функции
 * @constructor
 * @extends $
 */
$.Function = function () {

	function $Function(func) {
		this.src = func;
	}

	$Function.prototype = Object.assign(Object.create($.prototype), {

		constructor: $Function,

		inherit: function (Parent) {
			var Func = this.src, proto = Func.prototype;
			proto = Object.create(Parent.prototype);
			proto.constructor = Func;
			return this;
		}

	});

	return $Function;

}();
