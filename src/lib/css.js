"use strict";

lib.css = {

    prefix: new function () {

        var cache = {},
            prefixes = ["ms", "O", "Webkit", "Moz"],
            properties = new function () {
                var style = document.documentElement.style,
                    proto = style.constructor.prototype;
                return "top" in proto ? proto : style;
            };

        return function (property) {
            var i, name, prefixed;
            if (property in cache) {
                return cache[property];
            }
            if (property in properties) {
                cache[property] = property;
                return property;
            }
            name = property.charAt(0).toUpperCase() + property.slice(1);
            i = prefixes.length;
            while (i--) {
                prefixed = prefixes[i] + name;
                if (prefixed in properties) {
                    cache[property] = prefixed;
                    return prefixed;
                }
            }
            cache[property] = undefined;
            return undefined;
        };

    },

    get: function (element, properties) {
        var prefix = this.prefix, style = window.getComputedStyle(element);
        if (Array.isArray(properties)) {
            return properties.reduce(function (result, property) {
                result[property] = style[prefix(property)];
                return result;
            }, {});
        }
        return style[prefix(properties)];
    },

    getAnimationNames: new function () {
        var separator = /,\s*/;
        function excludeNone(value) {
            return "none" != value;
        }
        return function (style) {
            var names = style[this.animationName];
            if (names) {
                return names.split(separator).filter(excludeNone);
            }
            return [];
        };
    }

};

/* useful prefixed CSS properties
 * example:
 * if (lib.css.animation) {
 *     element.style[lib.css.animationDuration] = "3s";
 * }
 */
new function () {

    var ns = lib.css, properties = {
            animation: [
                "Delay", "Direction", "Duration", "FillMode", "IterationCount",
                "Name", "PlayState", "TimingFunction"
            ],
            transition: ["Delay", "Duration", "Property", "TimingFunction"],
            transform:  ["Origin", "Style"]
        };

    Object.keys(properties).forEach(function (composite) {
        var prefixed = ns.prefix(composite);
        if (prefixed) {
            ns[composite] = prefixed;
            properties[composite].forEach(function (single) {
                ns[composite + single] = prefixed + single;
            });
        }
    });

};

Object.assign(lib.css, {

    set: new function () {

        function changeStyle(style, properties) {
            Object.keys(properties).forEach(function (property) {
                style[lib.css.prefix(property)] = properties[property];
            });
        }

        if (lib.css.transition || lib.css.animation) {
            return function (element, properties) {
                var style = window.getComputedStyle(element),
                    animations = this.getAnimationNames(style);
                changeStyle(element.style, properties);
                return lib.event.awaitTransAnimEnd(element, animations);
            };
        }
        return function (element, properties) {
            changeStyle(element.style, properties);
            return Promise.resolve(element);
        };

    },

    getTransitionTime: lib.css.transition ? new function () {

        function parseFloats(string) {
            return string.split(",").map(function (string) {
                return Number.parseFloat(string) || 0;
            });
        }

        function calcTransitionTime(delay, duration) {
            var length = Math.max(duration.length, delay.length),
                i = 0, time, maxTime = 0;
            while (i < length) {
                time = (delay[i] || 0) + (duration[i] || 0);
                if (time > maxTime) {
                    maxTime = time;
                }
                i++;
            }
            return Math.ceil(maxTime * 1000);
        }

        return function (style) {
            return calcTransitionTime(
                parseFloats(style[lib.css.transitionDelay]),
                parseFloats(style[lib.css.transitionDuration])
            );
        };

    } : function () {
        return 0;
    }

});
