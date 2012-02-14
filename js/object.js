/**
 * Обёртка объекта
 * @constructor
 * @extends $
 * @param {Object} obj
 */
function $Object(obj) {
	this.src = obj;
}

/**
 * Копирует свойства в объект
 * @param {Object} target приёмник
 * @param {Object} source источник
 * @return {Object} target
 */
$Object.extend = function (target, source/*, source1, source2, …*/) {
	var key, keys, i = 1, j, len = arguments.length;
	while (i < len) {
		source = arguments[i];
		//используем массив имен свойст вместо for-in,
		//чтобы избавиться от проверки hasOwnProperty
		//и обойти баг в IE<9, когда переопределенные
		//стандартные свойства не становятся enumerable
		//пример: $Object.extend(obj, {toString: fn})
		keys = Object.keys(source);
		j = keys.length;
		while (j--) {
			key = keys[j];
			target[key] = source[key];
		}
		i++;
	}
	return target;
};

$.Object = $Object.extend($Object, {

	isObject: function (obj) {
		return Object.prototype.toString.call(obj) == "[object Object]";
	}

});

$Object.prototype = $Object.extend(Object.create($.prototype), {

	constructor: $Object,

	/**
	 * Общий интерфейс для get-set методов (prop, attr и др.),
	 * поведение зависит от args:
	 * ["key"]                    → get("key")
	 * [["key1", "key2"]]         → {key1: get("key1"), key2: get("key2")}
	 * ["key", val]               — set("key", val)
	 * [{key1: val1, key2: val2}] — set("key1", val1), set("key2", val2)
	 * @param {String} $get название get-метода (getProp, getAttr и др.)
	 * @param {String} $set название set-метода (setProp, setAttr и др.)
	 * @param {Arguments} args объект аргументов функции
	 * @return {Mixed}
	 */
	_getOrSet: function ($get, $set, args) {
		var i, key, keys, obj, arg = args[0];
		//$(…).prop("x", 1)
		if (args.length == 2) {
			return this[$set](arg, args[1]);
		}
		//$(…).prop("x")
		if (typeof arg == "string") {
			return this[$get](arg);
		}
		//$(…).prop(["x", "y"])
		if (Array.isArray(arg)) {
			obj = {};
			i = arg.length;
			while (i--) {
				key = arg[i];
				obj[key] = this[$get](key);
			}
			return obj;
		}
		//$(…).prop({x: 1, y: 2})
		keys = Object.keys(arg);
		i = keys.length;
		while (i--) {
			key = keys[i];
			this[$set](key, arg[key]);
		}
		return this;
	},

	is: function (arg) {
		if (typeof arg == "function") {
			return Boolean(arg(this.src));
		}
		return false;
	},

	not: function (arg) {
		return !this.is(arg);
	},

	hasProp: function (name) {
		return name in this.src;
	},

	delProp: function (name) {
		//todo перегрузить в $Element, чтобы в IE7
		//для DOM-элементов не возникала ошибка
		delete this.src[name];
		return this;
	},

	setProp: function (name, val) {
		this.src[name] = val;
		return this;
	},

	getProp: function (name) {
		return this.src[name];
	},

	/**
	 * Возвращает или устанавливает значения свойств
	 * $(obj).prop("x")          → obj.x
	 * $(obj).prop(["x", "y"])   → {x: obj.x, y: obj.y}
	 * $(obj).prop("x", 1)       — obj.x = 1
	 * $(obj).prop({x: 1, y: 2}) — obj.x = 1, obj.y = 2
	 */
	prop: function () {
		return this._getOrSet("getProp", "setProp", arguments);
	},

	on: function () {
	},

	off: function () {
	},

	fire: function () {
	}

});
