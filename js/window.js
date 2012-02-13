/**
 * Обёртка window
 * @constructor
 * @extends $
 * @param {Window} win
 */
function $Window(win) {
	this.src = win;
}

$.Window = $.extend($Window, {

	isWindow: typeof Window == "undefined" ? function (obj) {
		//todo contentWindow
		return obj.window && obj.self && obj.window == obj.self;
	}: function (obj) {
		return obj instanceof Window;
	}

});

$Window.prototype = $.extend(Object.create($.prototype), {

	constructor: $Window,

	on:   $Element.prototype.on,
	off:  $Element.prototype.off,
	fire: $Element.prototype.fire,

	viewPort: function () {
		var doc = document, body = doc.body, el = doc.createElement("viewport"), vp;
		el.style.cssText = [
			"display: block",
			"visibility: hidden",
			"position: fixed",
			"top: 0",
			"right: 0",
			"bottom: 0",
			"left: 0"
		].join(";");
		body.appendChild(el);
		vp = {
			width: el.offsetWidth,
			height: el.offsetHeight
		};
		body.removeChild(el);
		return vp;
	},

	doc: function () {
		return $(this.src.document);
	}

});
