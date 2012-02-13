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
 * Копирует свойства в объект
 * @param {Object} target приёмник
 * @param {Object} source источник
 * @return {Object} target
 */
$.extend = function (target, source/*, source1, source2, …*/) {
	var key, keys, i = 1, j, len = arguments.length;
	while (i < len) {
		source = arguments[i];
		//используем массив имен свойст вместо for-in,
		//чтобы избавиться от проверки hasOwnProperty
		//и обойти баг в IE<9, когда переопределенные
		//стандартные свойства не становятся enumerable
		//пример: $.extend(obj, {toString: fn})
		keys = Object.keys(source);
		j = keys.length;
		while (j--) {
			key = keys[j];
			target[key] = source[key];
		}
		i++;
	}
	return target;
};

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
