"use strict";

//Array and String generic methods polyfill
new function () {

    function fastApply(method, args) {
        var target = args[0];
        switch (args.length) {
            case 1:
                return method.call(target);
            case 2:
                return method.call(target, args[1]);
            case 3:
                return method.call(target, args[1], args[2]);
        }
        return method.apply(target, Array.prototype.slice.call(args, 1));
    }

    function createGeneric(method) {
        return function () {
            return fastApply(method, arguments);
        };
    }

    function createGenerics(source, names) {
        return names.reduce(function (methods, name) {
            methods[name] = createGeneric(source[name]);
            return methods;
        }, {});
    }

    function implement(object, methods) {
        Object.keys(methods).forEach(function (name) {
            if (!(name in object)) {
                object[name] = methods[name];
            }
        });
    }

    implement(Array, createGenerics(Array.prototype, [
        "concat", "every", "fill", "filter", "find",
        "findIndex", "forEach", "indexOf", "join",
        "lastIndexOf", "map", "pop", "push", "reduce",
        "reduceRight", "reverse", "shift", "slice",
        "some", "sort", "splice", "unshift"
    ]));

    implement(String, createGenerics(String.prototype, [
        "charAt", "charCodeAt", "concat", "contains","endsWith",
        "indexOf", "lastIndexOf", "match", "repeat", "replace",
        "search", "slice", "split", "startsWith", "substr",
        "substring", "toLowerCase", "toUpperCase", "trim"
    ]));

};
