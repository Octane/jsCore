'use strict';

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (string, position) {
        if (!position) {
            position = 0;
        }
        return this.indexOf(string, position) == position;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (string, position) {
        var lastIndex;
        position = position || this.length;
        position = position - string.length;
        lastIndex = this.lastIndexOf(string);
        return -1 != lastIndex && lastIndex == position;
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function (string, position) {
        return -1 != this.indexOf(string, position || 0);
    };
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        return new Array(count + 1).join(this);
    };
}
