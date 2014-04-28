"use strict";

window.requestAnimationFrame || Object.assign(window, {

	requestAnimationFrame: [
		window.oRequestAnimationFrame,
		window.msRequestAnimationFrame,
		window.mozRequestAnimationFrame,
		window.webkitRequestAnimationFrame,
		new function () {
			var fps = 60, delay = 1000 / fps, navigationStart, prevCallTime;
			navigationStart = prevCallTime = Date.now();
			return function (callback) {
				var currCallTime = Date.now(),
					timeout = Math.max(0, delay - (currCallTime - prevCallTime)),
					timeToCall = currCallTime + timeout;
				prevCallTime = timeToCall;
				return setTimeout(function () {
					callback(timeToCall - navigationStart);
				}, timeout);
			};
		}
	].find(Boolean),

	cancelAnimationFrame: [
		window.oCancelAnimationFrame,
		window.msCancelAnimationFrame,
		window.mozCancelAnimationFrame,
		window.webkitCancelAnimationFrame,
		window.cancelRequestAnimationFrame,
		window.oCancelRequestAnimationFrame,
		window.msCancelRequestAnimationFrame,
		window.mozCancelRequestAnimationFrame,
		window.webkitCancelRequestAnimationFrame,
		clearTimeout
	].find(Boolean)

});
