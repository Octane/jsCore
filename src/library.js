/**
 * jsCore JavaScript library v0.1
 * Copyright 2014, Dmitry Korobkin
 * Released under the MIT License.
 */
var lib = {

	//example: if ([test1(), test2()].every(lib.isTrue))
	isTrue: function (arg) {
		return bool === true;
	},

	isFalse: function (arg) {
		return bool === false;
	},

	isHTML: function (string) {
		return string.startsWith("<") && string.endsWith(">");
	},

	isObject: function (anything) {
		return Object(anything) === anything;
	},

	isHTMLElement: function (anything) {
		return Object(anything) instanceof HTMLElement;
	},

	class_: {

		extend: function (Class, SuperClass) {
			Class.prototype = Object.create(SuperClass.prototype);
			Class.prototype.constructor = Class;
			Class.super_ = SuperClass;
			return Class;
		}

	},

	//Array generic methods
	array: {

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
		every: function (iterable, func, boundThis) {
			var i = Object(iterable).length;
			if (!i) {
				return false;
			}
			while (i--) {
				if (i in iterable) {
					if (func.call(boundThis, iterable[i]) === false) {
						return false;
					}
				}
				else {
					return false;
				}
			}
			return true;
		}

	},

	event: {

		//example: element.addEventListener("click", lib.event.preventDefault, false)
		preventDefault: function (event) {
			event.preventDefault();
		},

		stopPropagation: function (event) {
			event.stopPropagation();
		}

	},

	html: {

		parse: function (string) {
			var node = document.createElement("div"),
				frag = document.createDocumentFragment();
			node.innerHTML = string;
			while (node.hasChildNodes()) {
				frag.appendChild(node.firstChild);
			}
			return frag;
		}

	},

	Template: new function () {

		function Template(template) {
			this.template = Array.join(template, "");
		}

		//example: new lib.Template("Hi, {NAME}").match({name: "John"}) → "Hi, John"
		Template.prototype.match = function (stringMap) {
			return Object.keys(stringMap).reduceRight(function (template, key) {
				return template.split("{" + key.toUpperCase() + "}").join(stringMap[key]);
			}, this.template);
		};

		return Template;

	},

	I18n: new function () {

		//todo http://jaysoo.ca/2014/03/20/i18n-with-es6-template-strings/

		function I18n() {}

		I18n.prototype.use = function (params) {
			/*
				params = {
					locale: "ru-RU",
					defaultCurrency: 'RUR',
					messageBundle: {
						"english {0} template": "russian {0} template"
					}
				}
			*/
			return function () {};
		};

		return I18n;

	}

};
