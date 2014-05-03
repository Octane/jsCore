'use strict';

Object.assign(lib, {

    //example: if (tests.every(lib.isTrue))
    isTrue: function (anything) {
        return true === anything;
    },

    isFalse: function (anything) {
        return false === anything;
    },

    isHTML: function (string) {
        return string.startsWith('<') && string.endsWith('>');
    },

    isObject: function (anything) {
        return Object(anything) === anything;
    },

    isHTMLElement: function (anything) {
        return anything instanceof HTMLElement;
    }

});
