
//IE8 Object.keys polyfill
({toString: null}).propertyIsEnumerable("toString") || new function () {

	//в IE8 переопределенные стандартные методы не становятся enumerable
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

if (!Object.getOwnPropertyNames) {
	//Warning: don't use this in IE8, it's fallback for Object.assign!
	Object.getOwnPropertyNames = Object.keys;
}

if (!Object.create) {
	Object.create = function (prototype) {
		if (1 in arguments) {
			throw new Error("Object.create implementation only accepts the first parameter");
		}
		function NOP() {}
		NOP.prototype = prototype;
		return new NOP;
	};
}
