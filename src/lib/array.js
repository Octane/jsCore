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
	},

	//удаляет несуществующие индексы
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
