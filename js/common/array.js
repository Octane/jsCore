//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
	Array.isArray = function (obj) {
		return Object.prototype.toString.call(obj) == "[object Array]";
	};
}

//http://wiki.ecmascript.org/doku.php?id=strawman:array_extras
if (!Array.from) {
	// для IE<9 перезаписывается в array-ie.js
	Array.from = Array.prototype.slice.call.bind(Array.prototype.slice);
	/*@cc_on
	(function () {
		//Array.from для IE<9
		var arrayFrom = Array.from;
		try {
			//[].slice.call(nodeList) приведет к ошибке
			arrayFrom(document.childNodes);
		}
		catch (error) {
			Array.from = function (iterable) {
				var i, array, length;
				//[].slice.call(string) вернет пустой массив
				if (typeof iterable == "string" || iterable instanceof String) {
					array = iterable.split("");
				}
				else {
					length = iterable.length;
					if (length) {
						//[].slice.call(object) выполнится без ошибок
						if (iterable instanceof Object) {
							array = arrayFrom(iterable);
						}
						//для NodeList и HTMLCollection
						else {
							array = [];
							i = 0;
							while (i < length) {
								if (i in iterable) {
									array[i] = iterable[i];
								}
								i++;
							}
						}
					}
					else {
						return [];
					}
				}
				//[…].slice(undefined, undefined) вернет пустой массив
				return arguments.length > 1 ? array.slice.apply(array, array.slice.call(arguments, 1)) : array;
			};
		}
	}());
	@*/
}

//http://wiki.ecmascript.org/doku.php?id=strawman:array_extras
if (!Array.of) {
	Array.of = function () {
		return Array.from(arguments);
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this) {
				func.call(boundThis, this[i], i, this);
			}
			i++;
		}
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
if (!Array.prototype.map) {
	Array.prototype.map = function (func, boundThis) {
		var i = 0, length = this.length, result = [];
		while (i < length) {
			if (i in this) {
				result[i] = func.call(boundThis, this[i], i, this);
			}
			i++;
		}
		return result;
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (anything) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && this[i] === anything) {
				return i;
			}
			i++;
		}
		return -1;
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function (anything) {
		var i = this.length;
		while (i--) {
			if (i in this && this[i] === anything) {
				return i;
			}
		}
		return -1;
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
	Array.prototype.filter = function (func, boundThis) {
		var i = 0, length = this.length, result = [];
		while (i < length) {
			if (i in this && func.call(boundThis, this[i], i, this)) {
				result.push(this[i]);
			}
			i++;
		}
		return result;
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
	Array.prototype.every = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && !func.call(boundThis, this[i], i, this)) {
				return false;
			}
			i++;
		}
		return true;
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.some) {
	Array.prototype.some = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && func.call(boundThis, this[i], i, this)) {
				return true;
			}
			i++;
		}
		return false;
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
if (!Array.prototype.reduce) {
	Array.prototype.reduce = function (func, initialValue) {
		var i = 0, length = this.length, currentValue;
		if (arguments.length < 2) {
			if (!length) {
				throw new TypeError("reduce of empty array with no initial value");
			}
			while (i < length) {
				if (i in this) {
					currentValue = this[i];
					i++;
					break;
				}
				i++;
			}
		}
		else {
			currentValue = initialValue;
		}
		while (i < length) {
			if (i in this) {
				currentValue = func(currentValue, this[i], i, this);
			}
			i++;
		}
		return currentValue;
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
	Array.prototype.reduceRight = function (func, initialValue) {
		var i = this.length, currentValue;
		if (arguments.length < 2) {
			if (!this.length) {
				throw new TypeError('reduce of empty array with no initial value');
			}
			while (i--) {
				if (i in this) {
					currentValue = this[i];
					break;
				}
			}
		}
		else {
			currentValue = initialValue;
		}
		while (i--) {
			if (i in this) {
				currentValue = func(currentValue, this[i], i, this);
			}
		}
		return currentValue;
	};
}
