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

		extend: function (SuperClass) {
			var Cls = this.src;
			Cls.prototype = Object.create(SuperClass.prototype);
			Cls.prototype.constructor = Cls;
			Cls.super_ = SuperClass;
			return this;
		}

	});

	return $Function;

}();
