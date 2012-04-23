//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = function (object) {
		var key, keys = [];
		if (Object(object) !== object) {
			throw new TypeError("Object.keys called on non-object");
		}
		for (key in object) {
			if (Object.prototype.hasOwnProperty.call(object, key)) {
				keys.push(key);
			}
		}
		return keys;
	};
	/*@cc_on
	if (!({toString: null}).propertyIsEnumerable("toString")) {
		//в IE<9 переопределенные стандартные методы не становятся enumerable
		(function () {
			var objectKeys = Object.keys,
				hasBug = [
					"constructor", "toString", "toLocaleString", "valueOf",
					"hasOwnProperty", "propertyIsEnumerable", "isPrototypeOf"
				];
			Object.keys = function (object) {
				var i = hasBug.length, key, keys = objectKeys(object);
				while (i--) {
					key = hasBug[i];
					if (Object.prototype.hasOwnProperty.call(object, key)) {
						keys.push(key);
					}
				}
				return keys;
			};
		}());
	}
	@*/
}


//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
if (!Object.create) {
	Object.create = function (proto) {
		if (arguments.length > 1) {
			throw new Error("Object.create implementation only accepts the first parameter.");
		}
		function NOP() {}
		NOP.prototype = proto;
		return new NOP();
	};
}
