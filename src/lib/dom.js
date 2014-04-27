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

	var promise, animationName = lib.css.animationName,
		transitionProperty = lib.css.transitionProperty;

	function changeClasses(element, method, classes) {
		var className = element.className,
			classList = element.classList;
		classes.forEach(function (className) {
			classList[method](className);
		});
		return className != element.className;
	}

	function changeClass(method, args) {
		return promise(args[0], method, Array.slice(args, 1));
	}

	function fallback(element) {
		return new Promise(function (resolve) {
			resolve(element);
		});
	}

	if (transitionProperty || animationName) {
		promise = function (element, method, classes) {
			var animations = getComputedStyle(element)[animationName];
			if (changeClasses(element, method, classes)) {
				return new Promise(function (resolve) {
					lib.event.awaitTransAnimEnd(element, animations).then(resolve);
				}).then();
			}
			return fallback(element);
		};
	}
	else {
		promise = function (element, method, classes) {
			changeClasses(element, method, classes);
			return fallback(element);
		};
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
