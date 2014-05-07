
//IE8 Array.slice fix
new function () {

    var slice = Array.prototype.slice;

    function toArray(iterable) {
        var result = [],
            length = iterable.length,
            i = 0;
        while (i < length) {
            result[i] = iterable[i];
            i++;
        }
        return result;
    }

    try {
        //array methods don't work with array-like DOM-objects in IE8
        Array.slice(document.documentElement.childNodes, 0);
    } catch (error) {
        Array.slice = function (iterable, start, end) {
            var result,
                length = arguments.length;
            //NodeList instanceof Object → false in IE8
            if (Object(iterable) instanceof Object) {
                result = iterable;
            } else {
                result = toArray(iterable);
            }
            //[1].slice(0, undefined) → [] in IE8
            if (1 == length || 2 == length && 0 == start) {
                return result == iterable ? slice.call(result, 0) : result;
            }
            if (2 == length) {
                return slice.call(result, start);
            }
            return slice.call(result, start, end);
        };
    }

};
