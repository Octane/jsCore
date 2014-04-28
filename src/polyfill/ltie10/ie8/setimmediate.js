
//IE8 setImmediate polyfill
document instanceof Object || Object.assign(window, new function () {

	var root = document.head, uid = 0, storage = {};

	function fastApply(args) {
		var func = args[0];
		switch (args.length) {
			case 1: return func();
			case 2: return func(args[1]);
			case 3: return func(args[1], args[2]);
		}
		return func.apply(window, Array.slice(args, 1));
	}

	return {

		setImmediate: function () {
			var args = arguments, id = uid++;
			function onReadyStateChange() {
				this.onreadystatechange = null;
				this.remove();
				if (storage[id]) {
					delete storage[id];
					fastApply(args);
				}
			}
			storage[id] = true;
			new function () {//avoid closure
				var script = document.createElement("script");
				script.onreadystatechange = onReadyStateChange;
				root.appendChild(script);
			}
			return id;
		},

		clearImmediate: function (id) {
			delete storage[id];
		}

	};

});
