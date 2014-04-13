"use strict";

lib.event = {

	//example: element.addEventListener("click", lib.event.preventDefault, false)
	preventDefault: function (event) {
		event.preventDefault();
	},

	stopPropagation: function (event) {
		event.stopPropagation();
	},

	//returns promise
	when: function (eventType, selector, root) {
		return Promise.resolve(new Promise(function (resolve) {
			lib.event.one(eventType, selector, root, resolve);
		}));
	},

	one: function (eventType, selector, root, callback) {
		var eventDetails = lib.event.on(eventType, selector, root, function (event) {
			lib.event.off(eventDetails);
			callback(event);
		});
		return eventDetails;
	},

	//returns event details
	on: function (eventType, selector, root, callback) {
		var listener;
		if ("function" == typeof root) {
			callback = root;
			root = document;
		}
		if ("string" != typeof selector) {
			root = selector;
			selector = "";
		}
		if (!root) {
			root = document;
		}
		if (selector) {
			listener = function (event) {
				var target = event.target;
				if (target.matches && target.matches(selector)) {
					callback.call(root, event);
				}
			};
		}
		else {
			listener = callback;
		}
		root.addEventListener(eventType, listener);
		return {
			root: root,
			type: eventType,
			callback: listener
		};
	},

	off: function (eventDetails) {
		eventDetails.root.removeEventListener(eventDetails.type, eventDetails.callback);
	}

};
