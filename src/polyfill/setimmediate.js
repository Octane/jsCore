"use strict";

window.setImmediate || Object.assign(window, window.msSetImmediate ? {

	//IE10
	setImmediate: window.msSetImmediate,
	clearImmediate: window.msClearImmediate

} : new function () {

	var id = 0, storage = {}, firstCall = true,
		message = "setImmediatePolyfillMessage";

	function fastApply(args) {
		var func = args[0];
		switch (args.length) {
			case 1: return func();
			case 2: return func(args[1]);
			case 3: return func(args[1], args[2]);
		}
		return func.apply(window, Array.slice(args, 1));
	}

	function callback(event) {
		var key, data;
		key = event.data;
		if ("string" == typeof key && key.startsWith(message)) {
			data = storage[key];
			if (data) {
				fastApply(data);
				delete storage[key];
			}
		}
	}

	return {

		setImmediate: function () {
			var key = message + ++id;
			storage[key] = arguments;
			if (firstCall) {
				firstCall = false;
				window.addEventListener("message", callback);
			}
			window.postMessage(key, "*");
			return id;
		},

		clearImmediate: function (id) {
			delete storage[message + id];
		}

	};

});
