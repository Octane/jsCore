/**
 * Обёртка функции
 * @constructor
 * @extends $
 * @param {Function} func
 */
function $Function(func) {
	this.src = func;
}

$.Function = $Object.extend($Function, {

	isFunction: function (obj) {
		return Object.prototype.toString.call(obj) == "[object Function]";
	}

});

$Function.prototype = $Object.extend(Object.create($.prototype), {

	constructor: $Function,

	inherit: function (Parent) {
		var Func = this.src;
		Func.prototype = Object.create(Parent.prototype);
		Func.prototype.constructor = Func;
		return this;
	},

	repeat: function (amount) {
		//setImmediate, MessageChannel
		//https://developer.mozilla.org/en/DOM/window.setImmediate
		//http://www.whatwg.org/specs/web-apps/current-work/complete/web-messaging.html#channel-messaging
		//http://habrahabr.ru/blogs/javascript/128079/
		//http://dbaron.org/log/20100309-faster-timeouts
	}

});
