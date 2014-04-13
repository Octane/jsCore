
window.getComputedStyle || new function () {

	function CSSStyleDeclaration() {
		return document.createElement("compStyle");
	}

	function toUpperCase(str) {
		return str.charAt(1).toUpperCase();
	}

	function toCamelCase(propName) {
		return propName.replace(/-./g, toUpperCase);
	}

	function getPropertyValue(propName) {
		propName = propName.toLowerCase();
		return this["float" == propName ? "cssFloat" : toCamelCase(propName)];
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
			compStyle = element._compStyle = new CSSStyleDeclaration;
			currStyle = element.currentStyle;
			Object.keys(currStyle).forEach(function (propName) {
				Object.defineProperty(compStyle, propName, createPropDesc(currStyle, propName));
			});
			Object.defineProperty(compStyle, "cssFloat", createCSSFloatDesc(currStyle));
			compStyle.getPropertyValue = getPropertyValue;
		}
		return compStyle;
	}

	window.getComputedStyle = getComputedStyle;

};
