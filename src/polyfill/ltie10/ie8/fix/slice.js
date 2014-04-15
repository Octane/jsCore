
//IE8 Array.slice fix
new function () {

	var slice = Array.prototype.slice;

	function toArray(iterable) {
		var i = 0, length = iterable.length, array = [];
		while (i < length) {
			array[i] = iterable[i];
			i++;
		}
		return array;
	}

	try {
		//array methods don't work with array-like DOM-objects in IE8
		Array.slice(document.documentElement.childNodes, 0);
	}
	catch (error) {
		Array.slice = function (iterable, start, end) {
			var length = arguments.length;
			//NodeList instanceof Object → false in IE8
			var array = Object(iterable) instanceof Object ? iterable : toArray(iterable);
			//[1].slice(0, undefined) → [] in IE8
			if (1 == length || 2 == length && 0 == start) {
				return array == iterable ? slice.call(array, 0) : array;
			}
			if (2 == length) {
				return slice.call(array, start);
			}
			return slice.call(array, start, end);
		};
	}

};
