"use strict";

lib.event = {

	//example: element.addEventListener("click", lib.event.preventDefault, false)
	preventDefault: function (event) {
		event.preventDefault();
	},

	stopPropagation: function (event) {
		event.stopPropagation();
	},

	when: function (element, selector, eventTypes) {
		if (arguments.length == 2) {
			eventTypes = selector;
			selector = null;
		}
		return new Promise(function (resolve) {
			lib.event.one(element, selector, eventTypes, resolve);
		}).then();
	},

	one: function (element, selector, eventTypes, callback) {
		if (arguments.length == 3) {
			callback = eventTypes;
			eventTypes = selector;
			selector = null;
		}
		var eventDetails = lib.event.on(element, selector, eventTypes, function (event) {
			lib.event.off(eventDetails);
			if (callback.handleEvent) {
				callback.handleEvent(event);
			}
			else {
				callback.call(element, event);
			}
		});
	},

	on: function (element, selector, eventTypes, callback) {
		var listener;
		if (arguments.length == 3) {
			callback = eventTypes;
			eventTypes = selector;
			selector = null;
		}
		if (selector) {
			selector += "," + selector + " *";
			listener = function (event) {
				var target = event.target;
				if (target.matches && target.matches(selector)) {
					if (callback.handleEvent) {
						callback.handleEvent(event);
					}
					else {
						callback.call(element, event);
					}
				}
			};
		}
		else {
			listener = callback;
		}
		if ("string" == typeof eventTypes) {
			eventTypes = eventTypes.split(/[\s,]+/);
		}
		eventTypes.forEach(function (eventType) {
			element.addEventListener(eventType, listener);
		});
		return {
			element: element,
			eventTypes: eventTypes,
			callback: listener
		};
	},

	off: function (eventDetails) {
		eventDetails.eventTypes.forEach(function (eventType) {
			eventDetails.element.removeEventListener(eventType, eventDetails.callback);
		});
	}

};
