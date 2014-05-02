'use strict';

lib.css = {

    prefix: new function () {
        var cache = {},
            prefixes = ['ms', 'O', 'Webkit', 'Moz'],
            properties = new function () {
                var style = document.documentElement.style,
                    proto = style.constructor.prototype;
                return 'top' in proto ? proto : style;
            };
        return function (property) {
            var prefixed,
                name,
                i;
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
        var style = window.getComputedStyle(element),
            prefix = this.prefix;
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
            return 'none' != value;
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

new function () {

    var css = lib.css;

    new function () {
        var properties = {
                animation: [
                    'Delay', 'Direction', 'Duration', 'FillMode',
                    'IterationCount', 'Name', 'PlayState', 'TimingFunction'
                ],
                transition: ['Delay', 'Duration', 'Property', 'TimingFunction'],
                transform:  ['Origin', 'Style']
            };
        Object.keys(properties).forEach(function (composite) {
            var prefixed = css.prefix(composite);
            if (prefixed) {
                css[composite] = prefixed;
                properties[composite].forEach(function (single) {
                    css[composite + single] = prefixed + single;
                });
            }
        });
    };

    css.set = new function () {
        function changeStyle(style, properties) {
            Object.keys(properties).forEach(function (property) {
                style[css.prefix(property)] = properties[property];
            });
        }
        if (css.transition || css.animation) {
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
    };

    css.getTransitionTime = css.transition ? new function () {
        function parseFloats(string) {
            return string.split(',').map(function (string) {
                return Number.parseFloat(string) || 0;
            });
        }
        function calcTransitionTime(delay, duration) {
            var maxTime = 0,
                time,
                length = Math.max(duration.length, delay.length),
                i = 0;
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
                parseFloats(style[css.transitionDelay]),
                parseFloats(style[css.transitionDuration])
            );
        };
    } : function () {
        return 0;
    };

};
