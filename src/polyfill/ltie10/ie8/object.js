
//IE8 Object.keys polyfill
({toString: null}).propertyIsEnumerable("toString") || new function () {

	//IE8 [[Enumerable]] bug
	var hasBug = [
			"constructor", "toString", "toLocaleString", "valueOf",
			"hasOwnProperty", "propertyIsEnumerable", "isPrototypeOf"
		];

	Object.keys = function (object) {
		var i = hasBug.length, key, keys = [], j = 0;
		for (key in object) {
			if (Object.hasOwnProperty.call(object, key)) {
				keys[j++] = key;
			}
		}
		while (i--) {
			key = hasBug[i];
			if (Object.hasOwnProperty.call(object, key)) {
				keys[j++] = key;
			}
		}
		return keys;
	};

};

if (!Object.create) {
	//Warning: Object.create(null) instanceof Object → true, and it doesn't fix!
	Object.create = function (prototype) {
		if (1 in arguments) {
			throw new Error("Object.create implementation only accepts the first parameter");
		}
		function NOP() {}
		NOP.prototype = prototype;
		return new NOP;
	};
}
