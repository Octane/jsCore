
//IE8 setImmediate polyfill
document instanceof Object || new function () {

	function fastApply(args) {
		var func = args[0];
		switch (args.length) {
			case 1: return func();
			case 2: return func(args[1]);
			case 3: return func(args[1], args[2]);
		}
		return func.apply(window, Array.slice(args, 1));
	}

	window.setImmediate = function () {
		var args = arguments;
		function onReadyStateChange() {
			this.onreadystatechange = null;
			this.remove();
			fastApply(args);
		}
		new function () {//avoid closure
			var script = document.createElement("script");
			script.onreadystatechange = onReadyStateChange;
			document.head.appendChild(script);
		}
		return 0;
	};

	window.clearImmediate = function () {};

};
