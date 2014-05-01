"use strict";

Object.assign(lib, {

    //example: if (tests.every(lib.isTrue))
    isTrue: function (bool) {
        return true === bool;
    },

    isFalse: function (bool) {
        return false === bool;
    },

    isHTML: function (string) {
        return string.startsWith("<") && string.endsWith(">");
    },

    isObject: function (anything) {
        return Object(anything) === anything;
    },

    isHTMLElement: function (anything) {
        return anything instanceof HTMLElement;
    }

});
