'use strict';

//IE9-11 Object.create bug fix
//webreflection.blogspot.com/2014/04/all-ie-objects-are-broken.html
(function () {
    var object = Object.create({});
    object[0] = null;
    return object.hasOwnProperty(0); //→ false in IE9-11
}()) || new function () {
    var create = Object.create;
    Object.create = function (prototype, properties) {
        var object = create(prototype, properties);
        if (!Object.hasOwnProperty.call(object, 0)) {
            //a numeric key fixes the bug,
            //it can be removed after,
            //unlike the alphabetic key
            Object.defineProperty(object, 0, {
                configurable: true
            });
            delete object[0];
        }
        return object;
    };
};

//using Object.keys: goo.gl/0QNMDz
//several sources: twitter.com/rwaldron/status/454114058640183296
//people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
if (!Object.assign) {
    Object.assign = function (target) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
            if (source) {
                Object.keys(source).forEach(function (key) {
                    target[key] = source[key];
                });
            }
        });
        return target;
    };
}

if (!Object.is) {
    Object.is = function (value1, value2) {
        if (0 === value1 && 0 === value2) {
            return 1 / value1 === 1 / value2;
        }
        if (value1 !== value1) {
            return value2 !== value2;
        }
        return value1 === value2;
    };
}

//IE10+
if (!Object.setPrototypeOf) {
    Object.setPrototypeOf = function (object, prototype) {
        object.__proto__ = prototype;
        return object;
    };
}
