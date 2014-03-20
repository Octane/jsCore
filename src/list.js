/**
 * Обёртка массива
 * @constructor
 * @extends $
 */
$.List = function () {

	function $List() {
		this.src = Array.apply(null, arguments);
	}

	$($List).inherit($);

	Object.assign($List, {

		from: function (iterable) {
			return (new this).source(Array.from(iterable));
		},

		of: function () {
			return this.from(arguments);
		},

		concat: function () {
			return this.from(Array.concat.apply(Array, arguments));
		},

		every: function () {
			throw new Error("$List.every not implemented");
		},

		filter: function () {
			throw new Error("$List.filter not implemented");
		},

		forEach: function () {
			throw new Error("$List.forEach not implemented");
		},

		indexOf: function () {
			throw new Error("$List.indexOf not implemented");
		},

		join: function () {
			throw new Error("$List.join not implemented");
		},

		lastIndexOf: function () {
			throw new Error("$List.lastIndexOf not implemented");
		},

		map: function () {
			throw new Error("$List.map not implemented");
		},

		pop: function () {
			throw new Error("$List.pop not implemented");
		},

		push: function () {
			throw new Error("$List.push not implemented");
		},

		reduce: function () {
			throw new Error("$List.reduce not implemented");
		},

		reduceRight: function () {
			throw new Error("$List.reduceRight not implemented");
		},

		reverse: function () {
			throw new Error("$List.reverse not implemented");
		},

		shift: function () {
			throw new Error("$List.shift not implemented");
		},

		slice: function () {
			throw new Error("$List.slice not implemented");
		},

		some: function () {
			throw new Error("$List.some not implemented");
		},

		sort: function () {
			throw new Error("$List.sort not implemented");
		},

		splice: function () {
			throw new Error("$List.splice not implemented");
		},

		unshift: function () {
			throw new Error("$List.unshift not implemented");
		},

		find: function () {
			throw new Error("$List.find not implemented");
		},

		findIndex: function () {
			throw new Error("$List.findIndex not implemented");
		}

	});

	Object.assign($List.prototype, {

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

		concat: function () {
			throw new Error("$List.prototype.concat not implemented");
		},

		every: function () {
			throw new Error("$List.prototype.every not implemented");
		},

		filter: function (func, boundThis) {
			return this.constructor.from(this.src.filter(func, boundThis));
		},

		forEach: function (func, boundThis) {
			this.src.forEach(func, boundThis);
			return this;
		},

		indexOf: function () {
			throw new Error("$List.prototype.indexOf not implemented");
		},

		join: function () {
			throw new Error("$List.prototype.join not implemented");
		},

		lastIndexOf: function () {
			throw new Error("$List.prototype.lastIndexOf not implemented");
		},

		map: function () {
			throw new Error("$List.prototype.map not implemented");
		},

		pop: function () {
			throw new Error("$List.prototype.pop not implemented");
		},

		push: function () {
			throw new Error("$List.prototype.push not implemented");
		},

		reduce: function () {
			throw new Error("$List.prototype.reduce not implemented");
		},

		reduceRight: function () {
			throw new Error("$List.prototype.reduceRight not implemented");
		},

		reverse: function () {
			throw new Error("$List.prototype.reverse not implemented");
		},

		shift: function () {
			throw new Error("$List.prototype.shift not implemented");
		},

		slice: function () {
			throw new Error("$List.prototype.slice not implemented");
		},

		some: function () {
			throw new Error("$List.prototype.some not implemented");
		},

		sort: function () {
			throw new Error("$List.prototype.sort not implemented");
		},

		splice: function () {
			throw new Error("$List.prototype.splice not implemented");
		},

		unshift: function () {
			throw new Error("$List.prototype.unshift not implemented");
		},

		find: function () {
			throw new Error("$List.prototype.find not implemented");
		},

		findIndex: function () {
			throw new Error("$List.prototype.findIndex not implemented");
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

	return $List;

}();
