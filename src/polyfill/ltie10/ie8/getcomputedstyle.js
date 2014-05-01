
window.getComputedStyle || (window.getComputedStyle = new function () {

    //https://github.com/es-shims/es5-shim/issues/152
    var uid = 0, fakeDoc = new ActiveXObject('htmlfile'),
        proto = createObject().constructor.prototype;

    function createObject() {
        return fakeDoc.getElementsByName(uid++);
    }

    function toUpperCase(str) {
        return str.charAt(1).toUpperCase();
    }

    function toCamelCase(property) {
        return property.replace(/-./g, toUpperCase);
    }

    function getPropertyValue(property) {
        property = property.toLowerCase();
        if ('float' == property) {
            return this.cssFloat;
        }
        return this[toCamelCase(property)];
    }

    function createPropDesc(style, property) {
        return {
            get: function () {
                return style[property];
            }
        };
    }

    function createCSSFloatDesc(style) {
        return {
            get: function () {
                return style.styleFloat;
            }
        };
    }

    function createOpacityDesc(filters) {
        return {
            get: function () {
                var alpha = filters['DXImageTransform.Microsoft.Alpha'] ||
                            filters.alpha;
                if (alpha) {
                    return String(alpha.opacity / 100);
                }
                return '1';
            }
        };
    }

    function getComputedStyle(element, pseudo) {
        if (pseudo) {
            throw new Error(
                'getComputedStyle implementation only accepts the 1st parameter'
            );
        }
        var compStyle = element._compStyle, currStyle;
        if (!compStyle) {
            compStyle = element._compStyle = createObject();
            currStyle = element.currentStyle;
            Object.keys(currStyle).forEach(function (property) {
                Object.defineProperty(
                    compStyle,
                    property,
                    createPropDesc(currStyle, property)
                );
            });
            Object.defineProperty(
                compStyle,
                'cssFloat',
                createCSSFloatDesc(currStyle)
            );
            Object.defineProperty(
                compStyle,
                'opacity',
                createOpacityDesc(element.filters)
            );
            compStyle.getPropertyValue = getPropertyValue;
        }
        return compStyle;
    }

    Object.keys(proto).forEach(function (key) {
        proto[key] = undefined;
    });
    proto = null;

    return getComputedStyle;

});
