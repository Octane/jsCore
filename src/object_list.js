/**
 * Обёртка списка
 * @constructor
 * @extends $
 */
$.ObjectList = function () {

	function $ObjectList(objects) {
		this.src = Array.from(objects);
	}

	$($ObjectList).extend($);

	Object.assign($ObjectList.prototype, {

		count: function () {
			//подсчет реального количсества элементов
			//http://javascript.ru/forum/misc/25392-rabota-s-massivom.html#post155335
			return this.src.reduce(function (length) {
				return length + 1;
			}, 0);
		},

		nth: function (i) {
			return $(this.src[i]);
		},

		first: function () {
			var array = this.src, length = array.length, i = 0;
			while (i < length) {
				if (i in array) {
					return $(array[i]);
				}
				i++;
			}
			return null;
		},

		last: function () {
			var array = this.src, i = array.length;
			while (i--) {
				if (i in array) {
					return $(array[i]);
				}
			}
			return null;
		},

		each: function (method) {
			var array = this.src, i, length, arg1, rest, $wrap;
			if (typeof method == "function") {
				return this.forEach(method, arguments[1]);
			}
			i = 0;
			length = array.length;
			switch (arguments.length) {
				case 1:
					while (i < length) {
						if (i in array) {
							$(array[i])[method]();
						}
						i++;
					}
					break;
				case 2:
					arg1 = arguments[1];
					while (i < length) {
						if (i in array) {
							$(array[i])[method](arg1);
						}
						i++;
					}
					break;
				default:
					rest = Array.slice(arguments, 1);
					while (i < length) {
						if (i in array) {
							$wrap = $(array[i]);
							$wrap[method].apply($wrap, rest);
						}
						i++;
					}
			}
			return this;
		},

		toArray: function () {
			return this.src;
		}

	});

	return $ObjectList;

}();
