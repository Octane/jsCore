/**
 * Обёртка document
 * @constructor
 * @extends $
 * @param {Document} doc
 */
function $Document(doc) {
	this.src = doc;
}

$.Document = $.extend($Document, {

	DOCUMENT_NODE: 9,

	isDocument: typeof Document == "undefined" ? function (obj) {
		return $Node.isNode(obj)  && obj.nodeType == this.DOCUMENT_NODE;
	} : function (obj) {
		//todo корректная проверка, если объект пришел из фрейма
		return obj instanceof Document;
	}

});

$Document.prototype = $.extend(Object.create($.prototype), {

	constructor: $Document,

	on:   $Element.prototype.on,
	off:  $Element.prototype.off,
	fire: $Element.prototype.fire,

	descendant:  $Element.prototype.descendant,
	descendants: $Element.prototype.descendants,

	ready: function (func) {
		/*
		//document ready
		(function () {
			document.getElementById("test").appendChild(document.createTextNode(document.readyState + "\n\r"));
			if ((/^(interactive|complete)$/).test(document.readyState)) {
			}
			else {
				setTimeout(arguments.callee, 10);
			}
		}());
		*/
	},

	win: function () {
		var doc = this.src;
		//todo ошибка в IE<9
		return $(doc.defaultView || doc.parentWindow);
	}

});
