//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = function () {
		//в IE<9 переопределенные стандартные методы не становятся enumerable
		var buggedKeys = [
				"constructor", "toString", "toLocaleString", "valueOf",
				"hasOwnProperty", "propertyIsEnumerable", "isPrototypeOf"
			],
			hasOwnProp = Object.prototype.hasOwnProperty,
			//todo hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString') из MDN
			enumBug = function () {
				for (var key in {toString: 1}) {
					if (key == "toString") {
						return false;
					}
				}
				return true;
			}();
		function getBuggedKeys(obj) {
			var i = buggedKeys.length, key, keys = [];
			while (i--) {
				key = buggedKeys[i];
				if (hasOwnProp.call(obj, key)) {
					keys.push(key);
				}
			}
			return keys;
		}
		return function (obj) {
			if (obj !== Object(obj)) {
				throw new TypeError("Object.keys called on non-object");
			}
			var key, keys = [];
			for (key in obj) {
				if (hasOwnProp.call(obj, key)) {
					keys.push(key);
				}
			}
			if (enumBug) {
				keys = keys.concat(getBuggedKeys(obj));
			}
			return keys;
		};
	}();
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
