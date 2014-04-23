"use strict";

lib.dom = {

	query: function (selector, root) {
		return new Promise(function (resolve, reject) {
			var element = (root || document).query(selector);
			if (element) {
				resolve(element);
			}
			else {
				reject(new Error("not matched"));
			}
		});
	},

	queryAll: function (selector, root) {
		return new Promise(function (resolve, reject) {
			var list = (root || document).queryAll(selector);
			if (list.length) {
				resolve(list);
			}
			else {
				reject(new Error("not matched"));
			}
		});
	},

	ready: function () {
		return new Promise(function (resolve) {
			if ("complete" == document.readyState) {
				resolve();
			}
			else {
				lib.event.one("DOMContentLoaded", document, resolve);
			}
		});
	},

	getTransitionTime: new function () {

		var style = document.documentElement.style,
			transitionDuration = [
				"transitionDuration",
				"OTransitionDuration",
				"MozTransitionDuration",
				"WebkitTransitionDuration"
			].find(isSupported),
			transitionDelay = [
				"transitionDelay",
				"OTransitionDelay",
				"MozTransitionDelay",
				"WebkitTransitionDelay"
			].find(isSupported);

		style = null;

		function isSupported(property) {
			return property in style;
		}

		function parseTime(string) {
			return string.split(",").map(function (time) {
				return Number.parseInt(time, 10);
			});
		}

		function getMaxTime(time1, time2) {
			var i = 0, length = Math.max(time1.length, time2.length), time, maxTime = 0;
			while (i < length) {
				time = (time1[i] || 0) + (time2[i] || 0);
				if (time > maxTime) {
					maxTime = time;
				}
				i++;
			}
			return maxTime;
		}

		if (transitionDuration && transitionDelay) {
			return function (element) {
				var style = getComputedStyle(element);
				return getMaxTime(parseTime(style[transitionDuration]), parseTime(style[transitionDelay])) * 1000;
			};
		}
		return function () {
			return 0;
		};

	}

};

new function () {

	function promise(element, method, classes) {
		return Promise.resolve(new Promise(function (resolve) {
			requestAnimationFrame(function () {
				var delay, className = element.className;
				changeClassList(element.classList, method, classes);
				if (className != element.className) {
					delay = lib.dom.getTransitionTime(element);
					if (delay) {
						setTimeout(function () {
							resolve(element);
						}, delay);
						return;
					}
				}
				resolve(element);
			});
		}));
	}

	function changeClassList(classList, method, classes) {
		classes.forEach(function (className) {
			classList[method](className);
		});
	}

	function changeClass(method, args) {
		return promise(args[0], method, Array.slice(args, 1));
	}

	Object.assign(lib.dom, {

		addClass: function () {
			return changeClass("add", arguments);
		},

		removeClass: function () {
			return changeClass("remove", arguments);
		},

		toggleClass: function () {
			return changeClass("toggle", arguments);
		}

	});

};
