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
		if ("complete" == document.readyState) {
			return Promise.resolve();
		}
		return lib.event.when(document, "DOMContentLoaded");
	}

};

//addClass, removeClass and toggleClass
Object.assign(lib.dom, new function () {

	var promise = lib.css.animation || lib.css.transition ? function (element, method, classes) {
			var animations = getComputedStyle(element)[lib.css.animationName];
			if (changeClasses(element, method, classes)) {
				return lib.event.awaitTransAnimEnd(element, animations);
			}
			return Promise.resolve(element);
		} : function (element, method, classes) {
			changeClasses(element, method, classes);
			return Promise.resolve(element);
		};

	function changeClasses(element, method, classes) {
		var className = element.className,
			classList = element.classList;
		classes.forEach(function (className) {
			classList[method](className);
		});
		return className != element.className;
	}

	function apply(method, args) {
		return promise(args[0], method, Array.slice(args, 1));
	}

	return {

		addClass: function () {
			return apply("add", arguments);
		},

		removeClass: function () {
			return apply("remove", arguments);
		},

		toggleClass: function () {
			return apply("toggle", arguments);
		}

	};

});
