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
	}

};

new function () {

	function promise(element, method, classes) {
		return new Promise(function (resolve) {
			requestAnimationFrame(function () {
				var delay, style, className = element.className;
				changeClassList(element.classList, method, classes);
				if (className != element.className) {
					style = getComputedStyle(element);
					/*delay = Math.max(
						lib.css.getTransitionTime(style),
						lib.css.getFiniteAnimationTime(style)
					);*/
					delay = lib.css.getTransitionTime(style);
					style = null;
					if (delay) {
						setTimeout(function () {
							resolve(element);
						}, delay);
						return;
					}
				}
				resolve(element);
			});
		});
	}

	function changeClassList(classList, method, classes) {
		classes.forEach(function (className) {
			classList[method](className);
		});
	}

	function changeClass(method, args) {
		return promise(args[0], method, Array.slice(args, 1)).then();
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
