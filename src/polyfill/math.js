"use strict";

if (!Math.trunc) {
    Math.trunc = function (value) {
        value = Number(value);
        if (isNaN(value) || 0 === value || !Number.isFinite(value)) {
            return value;
        }
        return Math.sign(value) * Math.floor(Math.abs(value));
    };
}

if (!Math.sign) {
    Math.sign = function (value) {
        if (0 === value || isNaN(value)) {
            return value;
        }
        return (value > 0) - (value < 0);
    };
}
