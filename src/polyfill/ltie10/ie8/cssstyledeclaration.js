
window instanceof Object || new function () {

	var proto = CSSStyleDeclaration.prototype;

	function toUpperCase(str) {
		return str.charAt(1).toUpperCase();
	}

	function toCamelCase(propName) {
		return propName.replace(/-./g, toUpperCase);
	}

	Object.defineProperty(proto, "cssFloat", {
		get: function () {
			return this.styleFloat;
		}
	});

	Object.defineProperty(proto, "getPropertyValue", {
		value: function (propName) {
			propName = propName.toLowerCase();
			if ("float" == propName) {
				return this.styleFloat;
			}
			return this[toCamelCase(propName)];
		}
	});

};
