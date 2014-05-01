'use strict';

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
        var result = [],
            anything,
            length = iterable.length,
            i = 0,
            j = 0;
        while (i < length) {
            anything = iterable[i];
            if (-1 == result.indexOf(anything)) {
                result[j++] = anything;
            }
            i++;
        }
        return result;
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
        var result = [];
        if (!(1 in arguments)) {
            end = i;
            i = 0;
        }
        while (i < end) {
            result.push(i);
            i++;
        }
        return result;
    },

    shuffle: function (iterable) {
        var result = Array.from(iterable),
            i = result.length,
            j,
            tmp;
        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = result[j];
            result[j] = result[i];
            result[i] = tmp;
        }
        return result;
    },

    remove: function (iterable, anything) {
        var index = Array.indexOf(iterable, anything);
        return -1 != index && Array.splice(iterable, index, 1);
    }

};
