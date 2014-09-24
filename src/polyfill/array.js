'use strict';

//bugs.ecmascript.org/show_bug.cgi?id=2435
if (!Array.from) {
    Array.from = function (iterable, func, boundThis) {
        if (func) {
            return Array.map(iterable, func, boundThis);
        }
        return Array.slice(iterable, 0);
    };
}

if (!Array.of) {
    Array.of = function () {
        return Array.from(arguments);
    };
}

if (!Array.prototype.find) {
    Array.prototype.find = function (func, boundThis) {
        var value,
            length = this.length,
            i = 0;
        while (i < length) {
            if (i in this) {
                value = this[i];
                if (func.call(boundThis, value, i, this)) {
                    return value;
                }
            }
            i++;
        }
        return undefined;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (func, boundThis) {
        var value,
            length = this.length,
            i = 0;
        while (i < length) {
            if (i in this) {
                value = this[i];
                if (func.call(boundThis, value, i, this)) {
                    return i;
                }
            }
            i++;
        }
        return -1;
    };
}

if (!Array.prototype.fill) {
    Array.prototype.fill = function (value, start, end) {
        var length = this.length,
            i;
        start = Number(start) || 0;
        if (2 in arguments) {
            end = Number(end) || 0;
        }
        else {
            end = length;
        }
        i = start < 0 ? Math.max(length + start, 0) : Math.min(start, length);
        end = end < 0 ? Math.max(length + end, 0) : Math.min(end, length);
        while (i < end) {
            this[i] = value;
            i++;
        }
        return this;
    };
}

if (!Array.prototype.contains) {
    Array.prototype.contains = function (anything, position) {
        var length = this.length,
            i;
        if (!length) {
            return false;
        }
        if (Number.isNaN(anything)) {
            if (1 in arguments) {
                position = Number(position) || 0;
                if (position < 0) {
                    i = Math.max(length + position, 0);
                } else {
                    i = position;
                }
            } else {
                i = 0;
            }
            while (i < length) {
                if (Number.isNaN(this[i])) {
                    return true;
                }
                i++;
            }
            return false;
        }
        return -1 != this.indexOf(anything, position);
    };
}
