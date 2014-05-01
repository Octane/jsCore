"use strict";

if (!Number.MAX_SAFE_INTEGER) {
    Number.MAX_SAFE_INTEGER = 9007199254740991;
}

if (!Number.isFinite) {
    Number.isFinite = function (value) {
        return "number" == typeof value && isFinite(value);
    };
}

if (!Number.isInteger) {
    Number.isInteger = function (value) {
        return "number" == typeof value && isFinite(value) && value > -9007199254740992 && value < 9007199254740992 && Math.floor(value) == value;
    };
}

if (!Number.isNaN) {
    Number.isNaN = function (value) {
        return "number" == typeof value && isNaN(value);
    };
}

if (!Number.parseInt) {
    Number.parseInt = parseInt;
}

if (!Number.parseFloat) {
    Number.parseFloat = parseFloat;
}
