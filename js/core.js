/**
 *
 * @namespace
 * @constructor
 * @param {Mixed} arg
 * @return {Mixed}
 */
function $(arg) {
	//в strict режиме this может быть undefined
	if (this && this.constructor === $) {
		//todo создавать новый элемент по CSS-селектору
		//или клонировать существующий 
	}
	if (arg instanceof $) {
		return arg;
	}
	if (typeof arg == "string") {
		return $(document).descendant(arg);
	}
	if (Object(arg) === arg) {
		//todo $DocumentFragment и другие типы
		//todo проверка isNode выполняется несколько раз
		if ($.Function.isFunction(arg)) {
			return new $.Function(arg);
		}
		if ($.Array.isArray(arg)) {
			return new $.Array(arg);
		}
		if ($.Element.isElement(arg)) {
			return new $.Element(arg);
		}
		if ($.Document.isDocument(arg)) {
			return new $.Document(arg);
		}
		if ($.Window.isWindow(arg)) {
			return new $.Window(arg);
		}
		if ($.Node.isNode(arg)) {
			return new $.Node(arg);
		}
		return new $.Object(arg);
	}
	return null;
}

/**
 * Конструкторы обёрток наследуют этот метод
 * и помещают исходный объект в src
 */
$.prototype.source = function (src) {
	if (arguments.length) {
		this.src = src;
	}
	return this.src;
};
