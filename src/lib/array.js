"use strict";

lib.array = {

	//подсчет реального количсества элементов
	//http://javascript.ru/forum/misc/25392-rabota-s-massivom.html#post155335
	count: function (iterable) {
		return Array.reduce(iterable, function (length) {
			return length + 1;
		}, 0);
	},

	contains: function (iterable, anything, position) {
		return Array.indexOf(iterable, anything, position) != -1;
	},

	unique: function (iterable) {
		var anything, array = [], i = 0, j = 0, length = iterable.length;
		while (i < length) {
			anything = iterable[i];
			if (array.indexOf(anything) == -1) {
				array[j++] = anything;
			}
			i++;
		}
		return array;
	},

	//Array.every игнорирует пропущенные индексы,
	//и всегда возвращает true для пустого массива
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
			}
			else {
				return false;
			}
		}
		return true;
	}

	//удаляет несуществующие индексы
	refine: function (iterable) {
		return Array.reduce(iterable, function (array, anything) {
			array.push(anything);
			return array;
		}, []);
	}

};
