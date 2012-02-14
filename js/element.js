/**
 * Обёртка элемента
 * @constructor
 * @extends $Node
 * @param {Element} element
 */
function $Element(element) {
	this.src = element;
}

$.Element = $Object.extend($Element, {

	ELEMENT_NODE: 1,

	/**
	 * Выясняет, является ли объект DOM-элементом
	 * @param {Object} obj
	 * @return {Boolean}
	 */
	isElement: typeof Element == "undefined" ? function (obj) {
		return $Node.isNode(obj)  && obj.nodeType == this.ELEMENT_NODE;
	} : function (obj) {
		return obj instanceof Element;
	}

});

$Element.prototype = $Object.extend(Object.create($Node.prototype), {

	constructor: $Element,

	is: function (arg) {
		//todo другие типы arg
		if (typeof arg == "string") {
			return this.isEqToSel(arg);
		}
		return $Object.prototype.is.call(this, arg);
	},

	_isEqToSel: function (sel) {
		var i, name, names, attr, val, attrs, el = this.src, comp = $.selector.comparison;
		if ("id" in sel && sel.id != el.id) {
			return false;
		}
		if ("tag" in sel && sel.tag != el.tagName.toLowerCase()) {
			return false;
		}
		if (sel.attrs) {
			names = sel.attrNames;
			attrs = this.attr(names);
			i = names.length;
			while (i--) {
				name = names[i];
				val  = attrs[name];
				attr = sel.attrs[name];
				if (val === null || ("value" in attr && !comp[attr.comparison](val, attr.value))) {
					return false;
				}
			}
		}
		if (sel.classes) {
			return this.hasClass(sel.classes);
		}
		return true;
	},

	/**
	 * Сравнивает элемент с селектором
	 * @param {String} sel
	 * @return {Boolean}
	 */
	isEqToSel: function (sel) {
		sel = $.selector.apart(sel);
		var i = sel.length;
		while (i--) {
			if (!this._isEqToSel(sel[i])) {
				return false;
			}
		}
		return true;
	},

	after: function () {
	},

	before: function () {
	},

	next: function () {
	},

	prev: function () {
	},

	first: function () {
	},

	last: function () {
	},

	children: function () {
	},

	descendant: function (sel) {
	},

	descendants: function () {
	},

	append: function () {
	},

	prepend: function () {
	},

	empty: function () {
	},

	hasAttr: function () {
	},

	delAttr: function (name) {
		this.src.removeAttr(name);
		return this;
	},

	setAttr: function (name, val) {
		this.src.setAttribute(name, String(val));
		return this;
	},

	getAttr: function (name) {
		var val = this.src.getAttribute(name);
		return val === null ? null : String(val);
	},

	attr: function () {
		return this._getOrSet("getAttr", "setAttr", arguments);
	},

	hasData: function () {
	},

	delData: function () {
	},

	setData: function () {
		//todo сделать преобразование ключей по стандарту,
		//по возможности использовать встроенный интерфейс
		//https://developer.mozilla.org/en/DOM/element.dataset
		//http://www.w3.org/TR/html5/elements.html#dom-dataset
	},

	getData: function () {
	},

	data: function () {
		return this._getOrSet("getData", "setData", arguments);
	},

	setCSSProp: function () {
	},

	getCSSProp: function () {
	},

	css: function () {
	},

	hasClass: function () {
	},

	delClass: function () {
	},

	addClass: function () {
	},

	toggleClass: function () {
	},

	classes: function () {
	},

	animate: function () {
		//requestAnimationFrame
		//http://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
		//http://habrahabr.ru/company/microsoft/blog/137705/
		//http://jsfiddle.net/paul/XQpzU/
		/*window.requestAnimFrame = (function() {
			return 
				window.requestAnimationFrame || 
				window.msRequestAnimationFrame ||
				window.mozRequestAnimationFrame || 
				window.oRequestAnimationFrame || 
				window.webkitRequestAnimationFrame || 
				(function(callback) { window.setTimeout(callback, 1000 / 60); });
		})();*/
	},

	subscribe: function (evType, func, useCapturing) {
	},

	toList: function () {
		return new $.ElementList([this.src]);
	}

});
