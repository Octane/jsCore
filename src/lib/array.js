"use strict";

lib.array = {

    //counts the actual number of elements
    //http://javascript.ru/forum/155335-post38.html
    //example: count([1,,2]) → 2, but [1,,2].length → 3
    count: function (iterable) {
        return Array.reduce(iterable, function (length) {
            return length + 1;
        }, 0);
    },

    contains: function (iterable, anything, position) {
        return -1 != Array.indexOf(iterable, anything, position);
    },

    unique: function (iterable) {
        var anything, array = [], i = 0, j = 0, length = iterable.length;
        while (i < length) {
            anything = iterable[i];
            if (-1 == array.indexOf(anything)) {
                array[j++] = anything;
            }
            i++;
        }
        return array;
    },

    //Array.every ignores missing indexes and
    //always returns true for an empty array
    all: function (iterable, func, boundThis) {
        var i = Object(iterable).length;
        if (!i) {
            return false;
        }
        while (i--) {
            if (i in iterable) {
                if (!func.call(boundThis, iterable[i])) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    },

    //shifts array indexes, so that was not missed
    //example: refine([1,,2]) → [1, 2]
    refine: function (iterable) {
        return Array.reduce(iterable, function (array, anything) {
            array.push(anything);
            return array;
        }, []);
    },

    range: function (i, end) {
        var array = [];
        if (!(1 in arguments)) {
            end = i;
            i = 0;
        }
        while (i < end) {
            array.push(i);
            i++;
        }
        return array;
    },

    shuffle: function (iterable) {
        var array = Array.from(iterable), i = array.length, j, tmp;
        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = array[j];
            array[j] = array[i];
            array[i] = tmp;
        }
        return array;
    },

    remove: function (iterable, anything) {
        var index = Array.indexOf(iterable, anything);
        return -1 != index && Array.splice(iterable, index, 1);
    }

};
