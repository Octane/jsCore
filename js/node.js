/**
 * Обёртка узла
 * @constructor
 * @extends $Object
 * @param {Node} node
 */
function $Node(node) {
	this.src = node;
}

$.Node = $.extend($Node, {

	/**
	 * Выясняет, является ли объект DOM-узлом
	 * @param   {Object} obj
	 * @returns {Boolean}
	 */
	isNode: typeof Node == "undefined" ? function (obj) {
		//DOM-объекты в IE<9 не являются потомками Object
		return !(obj instanceof Object) && isFinite(obj.nodeType);
	} : function (obj) {
		return obj instanceof Node;
	}

});

$Node.prototype = $.extend(Object.create($Object.prototype), {

	constructor: $Node,

	is: function (arg) {
		//todo другие типы arg
		if (typeof arg == "string") {
			return this.src.nodeValue == arg;
		}
		return $.Object.prototype.is.call(this, arg);
	},

	parent: function () {
	},

	ancestor: function () {
	},

	appendTo: function (arg) {
		return $(arg).append(this.src);
	},

	prependTo: function (arg) {
		return $(arg).prepend(this.src);
	},

	insAfter: function (arg) {
		return $(arg).after(this.src);
	},

	insBefore: function (arg) {
		return $(arg).before(this.src);
	},

	wrap: function (arg) {
	},

	remove: function () {
	},

	clone: function () {
	},

	toList: function () {
		return new $.NodeList([this.src]);
	}

});
