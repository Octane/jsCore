/**
 * Обёртка элемента ввода
 * @constructor
 * @extends $Element
 * @param {Element} input
 */
function $InputElement(input) {
	this.src = input;
}

$.InputElement = $Object.extend($InputElement, {

	isInputElement: function () {
	}

});

$InputElement.prototype = $Object.extend(Object.create($Element.prototype), {

	constructor: $InputElement,

	setVal: function (val) {
		this.src.value = val;
		return this;
	},

	getVal: function () {
		return this.src.value;
	},

	val: function (val) {
		if (arguments.length) {
			return this.setVal(val);
		}
		return this.getVal();
	}

});
