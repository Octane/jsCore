
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
		//в IE8 методы массива не работают с DOM-объектами
		Array.slice(document.documentElement.childNodes, 0);
	}
	catch (error) {
		Array.slice = function (iterable, start, end) {
			var length = arguments.length;
			//IE8: NodeList instanceof Object → false
			var array = Object(iterable) instanceof Object ? iterable : toArray(iterable);
			//IE8: [1].slice(0, undefined) → []
			if (length == 1 || (length == 2 && start == 0)) {
				return array == iterable ? slice.call(array, 0) : array;
			}
			if (length == 2) {
				return slice.call(array, start);
			}
			return slice.call(array, start, end);
		};
	}

};
