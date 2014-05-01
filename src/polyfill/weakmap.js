"use strict";

var WeakMap = WeakMap || new function () {

    //todo
    //In native WeakMaps, references to key objects are held "weakly",
    //which means that they do not prevent garbage collection in case
    //there would be no other reference to the object.

    var KEY = 0, VALUE = 1;

    function WeakMap() {
        if (arguments.length) {
            //todo
            throw Error("WeakMap implementation doesn't accept parameters");
        }
        this.length = 0;
    }

    function equalKey(pair) {
        //this → key
        return this === pair[KEY];
    }

    function validKey(key) {
        if (Object(key) !== key) {
            throw TypeError("Invalid value used as weak map key");
        }
        return key;
    }

    Object.assign(WeakMap.prototype, {

        _getPair: function (key) {
            return Array.find(this, equalKey, validKey(key));
        },

        set: function (key, value) {
            var pair = this._getPair(key);
            if (pair) {
                pair[VALUE] = value;
            }
            else {
                Array.push(this, [key, value]);
            }
        },

        get: function (key) {
            return Object(this._getPair(key))[VALUE];
        },

        has: function (key) {
            return Boolean(this._getPair(key));
        },

        "delete": function (key) {
            var index = Array.findIndex(this, equalKey, validKey(key));
            if (-1 == index) {
                return false;
            }
            Array.splice(this, index, 1);
            return true;
        },

        clear: function () {
            Array.splice(this, 0, this.length);
        }

    });

    return WeakMap;

};
