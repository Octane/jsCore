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
		//todo img, iframe support
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
