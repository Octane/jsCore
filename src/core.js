/**
 * Универсальная функция
 */
function $(anything) {
	if (typeof anything == "function") {
		return new $.Function(anything);
	}
	return $.one(anything);
}

Object.assign($, {

	every: function (iterable, func) {
		//Array.every игнорирует пропущенные индексы,
		//и всегда возвращает true для пустого массива
		var i = Object(iterable).length;
		if (!i) {
			return false;
		}
		while (i--) {
			if (i in iterable) {
				if (func(iterable[i]) === false) {
					return false;
				}
			}
			else {
				return false;
			}
		}
		return true;
	},

	isObject: function (anything) {
		return Object(anything) === anything;
	},

	isNode: function (anything) {
		//return Object(anything) instanceof Node;
		//fix IE8
		return Object(anything).ownerDocument && $.isElement(anything.ownerDocument.documentElement);
	},

	isElement: function (anything) {
		return Object(anything) instanceof HTMLElement;
	},

	isObjectList: function (anything) {
		return $.every(anything, $.isObject);
	},

	isNodeList: function (anything) {
		return  $.every(anything, $.isNode);
	},

	isElementList: function (anything) {
		return  $.every(anything, $.isElement);
	},

	one: function (anything) {
		if (typeof anything == "string") {
			anything = document.querySelector(anything);
			return anything ? new $.Element(anything) : null;
		}
		if ($.isElement(anything)) {
			return new $.Element(anything);
		}
		if ($.isNode(anything)) {
			return new $.Node(anything);
		}
		if ($.isObject(anything)) {
			return new $.Object(anything);
		}
		return null;
	},

	all: function (anything) {
		if (typeof anything == "string") {
			return new $.ElementList(document.querySelectorAll(anything));
		}
		if ($.isElementList(anything)) {
			return new $.ElementList(anything);
		}
		if ($.isNodeList(anything)) {
			return new $.NodeList(anything);
		}
		return new $.ObjectList(anything);
	}

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
