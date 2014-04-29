
window.getComputedStyle || new function () {

	//https://github.com/es-shims/es5-shim/issues/152
	var uid = 0, fakeDoc = new ActiveXObject("htmlfile"),
		proto = createObject().constructor.prototype;

	function createObject() {
		return fakeDoc.getElementsByName(uid++);
	}

	function toUpperCase(str) {
		return str.charAt(1).toUpperCase();
	}

	function toCamelCase(propName) {
		return propName.replace(/-./g, toUpperCase);
	}

	function getPropertyValue(propName) {
		propName = propName.toLowerCase();
		if ("float" == propName) {
			return this.cssFloat;
		}
		return this[toCamelCase(propName)];
	}

	function createPropDesc(obj, propName) {
		return {
			get: function () {
				return obj[propName];
			}
		};
	}

	function createCSSFloatDesc(obj) {
		return {
			get: function () {
				return obj.styleFloat;
			}
		};
	}

	function getComputedStyle(element) {
		var compStyle = element._compStyle, currStyle;
		if (!compStyle) {
			compStyle = element._compStyle = createObject();
			currStyle = element.currentStyle;
			Object.keys(currStyle).forEach(function (propName) {
				Object.defineProperty(compStyle, propName, createPropDesc(currStyle, propName));
			});
			Object.defineProperty(compStyle, "cssFloat", createCSSFloatDesc(currStyle));
			compStyle.getPropertyValue = getPropertyValue;
		}
		return compStyle;
	}

	Object.keys(proto).forEach(function (key) {
		proto[key] = undefined;
	});
	proto = null;

	window.getComputedStyle = getComputedStyle;

};
