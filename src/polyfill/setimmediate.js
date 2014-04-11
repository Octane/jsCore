"use strict";

window.setImmediate || new function () {

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
		if (typeof key == "string" && key.startsWith(message)) {
			data = storage[key];
			if (data) {
				fastApply(data);
				delete storage[key];
			}
		}
	}

	function setImmediate() {
		var key = message + ++id;
		storage[key] = arguments;
		if (firstCall) {
			firstCall = false;
			addEventListener("message", callback);
		}
		postMessage(key, "*");
		return id;
	}

	function clearImmediate(id) {
		delete storage[message + id];
	}

	window.setImmediate = setImmediate;
	window.clearImmediate = clearImmediate;

};
