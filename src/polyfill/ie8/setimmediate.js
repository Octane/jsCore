
//IE8 setImmediate polyfill
document instanceof Object || new function () {

	var fakeScript = document.createElement("script"),
		root = document.documentElement;

	//todo code reuse
	function fastApply(args) {
		var func = args[0];
		switch (args.length) {
			case 1: return func();
			case 2: return func(args[1]);
			case 3: return func(args[1], args[2]);
		}
		return func.apply(window, Array.slice(args, 1));
	}

	function setImmediate () {
		var args = arguments, tmpScript = fakeScript.cloneNode(false);
		tmpScript.onreadystatechange = function () {
			fastApply(args);
			tmpScript.onreadystatechange = null;
			root.removeChild(tmpScript);
			tmpScript = null;
		};
		root.appendChild(tmpScript);
		return 0;
	}

	function clearImmediate() {}

	window.setImmediate = setImmediate;
	window.clearImmediate = setImmediate;

};
