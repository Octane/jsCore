
//IE8 Object.keys polyfill
({toString: null}).propertyIsEnumerable('toString') || new function () {

    //IE8 DontEnum bug fix
    var hasBug = [
            'constructor', 'toString', 'toLocaleString', 'valueOf',
            'hasOwnProperty', 'propertyIsEnumerable', 'isPrototypeOf'
        ];

    Object.keys = function (object) {
        var i = hasBug.length, key, keys = [], j = 0;
        for (key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                keys[j++] = key;
            }
        }
        while (i--) {
            key = hasBug[i];
            if (Object.hasOwnProperty.call(object, key)) {
                keys[j++] = key;
            }
        }
        return keys;
    };

};

if (!Object.create) {
    //Warning: Object.create(null) instanceof Object → true
    Object.create = function (prototype, properties) {
        if (properties) {
            throw new Error('Object.create implementation ' +
                            'only accepts the 1st parameter');
        }
        function NOP() {}
        NOP.prototype = prototype;
        return new NOP;
    };
}

//Creates an object that supports getters and setters
var ES5Object = window instanceof Object || new function () {

    function createLengthDesc() {
        var length;
        return {
            get: function () {
                return length;
            },
            set: function (value) {
                length = value;
            }
        };
    }

    function fixLength(obj) {
        return Object.defineProperty(obj, 'length', createLengthDesc());
    }

    return new function () {//avoid closure

        //github.com/es-shims/es5-shim/issues/152
        var fake = new ActiveXObject('htmlfile'),
            proto = ES5Object().constructor.prototype,
            uid = 0;

        function ES5Object() {
            return fixLength(fake.getElementsByName(uid++));
        }

        proto.urns = undefined;
        proto.tags = undefined;
        proto.item = undefined;
        proto.namedItem = undefined;
        proto = null;

        return ES5Object;
    };

};
