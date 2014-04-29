
window instanceof Object || new function () {

	var proto = CSSStyleDeclaration.prototype,
		prefix = "progid:DXImageTransform.Microsoft.",
		alpha = "Alpha(opacity={VALUE}, enabled={ENABLED})",
		opacityRegExp = /\bopacity\s*=\s*(\d+)/i,
		alphaRegExp = /alpha\s*\(.*?\)/i;

	function toUpperCase(str) {
		return str.charAt(1).toUpperCase();
	}

	function toCamelCase(property) {
		return property.replace(/-./g, toUpperCase);
	}

	function fixFontSmoothing(filter, value) {
		return filter.replace("{ENABLED}", 1 != value);
	}

	function createAlphaFilter(value) {
		return fixFontSmoothing(alpha.replace("{VALUE}", Math.trunc(value * 100)), value);
	}

	function changeAlphaFilter(filter, value) {
		return filter.replace(alphaRegExp, createAlphaFilter(value));
	}

	function hasAlphaFilter(filter) {
		return filter.toLowerCase().contains("alpha");
	}

	Object.defineProperty(proto, "cssFloat", {
		get: function () {
			return this.styleFloat;
		},
		set: function (value) {
			this.styleFloat = value;
		}
	});

	Object.defineProperty(proto, "opacity", {
		get: function () {
			var opacity = "", filter = this.filter.trim();
			if (filter) {
				filter.replace(alphaRegExp, function (alpha) {
					alpha.replace(opacityRegExp, function (str, value) {
						opacity = String(value / 100);
					});
				});
			}
			return opacity;
		},
		set: function (value) {
			var filter = this.filter.trim();
			if (value < 0) {
				value = 0;
			}
			else if (value > 1) {
				value = 1;
			}
			if (filter) {
				if (hasAlphaFilter(filter)) {
					this.filter = changeAlphaFilter(filter, value);
				}
				else {
					this.filter += " " + prefix + createAlphaFilter(value);
				}
			}
			else {
				this.filter = prefix + createAlphaFilter(value);
			}
		}
	});

	Object.defineProperty(proto, "getPropertyValue", {
		value: function (property) {
			property = property.toLowerCase();
			if ("float" == property) {
				return this.styleFloat;
			}
			return this[toCamelCase(property)];
		}
	});

	Object.defineProperty(proto, "setProperty", {
		value: function (property, value) {
			property = property.toLowerCase();
			if ("float" == property) {
				this.styleFloat = value;
			}
			this[toCamelCase(property)] = value;
		}
	});

};
