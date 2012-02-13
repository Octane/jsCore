/**
 * Модуль работы с CSS-селекторами
 * @namespace
 */
$.selector = {

	ALL:        false,
	FIRST:      true,
	CHILD:      false,
	DESCENDANT: true,

	_cache: {},

	/**
	 * Поиск элементов
	 * @param {String}  [sel   = "*"]      селектор
	 * @param {Element} [root  = document] корневой элемент
	 * @param {Boolean} [first = false]    только первый
	 * @param {Boolean} [depth = true]     среди потомков
	 * @return {Array}
	 */
	query: $.features.selectors ? function (sel, root, first, depth) {
		var i, len, array, node, res;
		if (!sel) {
			sel = "*";
		}
		if (!root) {
			root = document;
		}
		res = root[first ? "querySelector" : "querySelectorAll"](sel);
		if (!res) {
			return null;
		}
		if (depth === $.CHILD) {
			if (first) {
				if (res.parentNode != root) {
					return null;
				}
			}
			else {
				i = 0;
				len = res.length;
				array = [];
				while (i < len) {
					node = res[i];
					if (node.parentNode == root) {
						array.push(node);
					}
					i++;
				}
				return array;
			}
		}
		return res;//todo всегда возращать array
	} : function (sel, root, first, depth) {
		//todo Selectors API для IE7
		//заглушка
		if (depth) {
			sel = this.apart(sel)[0];
			var list = document.getElementsByTagName(sel.tag);
			return first ? list[0] : list;
		}
		$console.error("$.selector.query not implemented for IE7");
		return first ? null : [];
	},

	/**
	 * способы сравнения значения атрибута
	 */
	_comparison: {

		"=" : function(str1, str2){
			return str1 == str2;
		},

		"^=" : function(str1, str2){
			return str1.substr(0, str2.length) == str2;
		},

		"$=" : function(str1, str2){
			return str1.substr(str1.length - str2.length) == str2;
		},

		"*=" : function(str1, str2){
			return str1.indexOf(str2) != -1;
		},

		"|=" : function(str1, str2){
			return str1 == str2 || str1.substr(0, str2.length + 1) == str2 + "-";
		},

		"~=" : function(str1, str2){
			return (" " + str1 + " ").indexOf(" " + str2 + " ") != -1;
		}
	},

	_specChr: {
		",": "\uFFFA",
		".": "\uFFFB",
		"#": "\uFFFC",
		"[": "\uFFFD",
		"'": "\uFFFE",
		'"': "\uFFFF",
		"\uFFFA": ",",
		"\uFFFB": ".",
		"\uFFFC": "#",
		"\uFFFD": "[",
		"\uFFFE": "'",
		"\uFFFF": '"'
	},

	_regExp: {
		slash: /\\([.:])/g,
		specChr: /[,.#\['"]/g,
		escaped: /[\uFFFA-\uFFFF]/g,
		quoted: /'[^']+?'/g,
		dblQuoted: /"[^"]+?"/g,
		composite: / *, */,
		component: {
			pattern: /(^|[.#\[])([^.#\[]*)/g,
			TYPE: 1,
			VAL:  2
		},
		attr: {
			pattern: /^([^\^$*|~="']+)([\^$*|~]?=)?(.*)/,
			NAME: 1,
			COMP: 2,
			VAL:  3
		}
	},

	_attrs: function (list) {
		var re = this._regExp.attr,
			attr, attrs = {},
			name, names = [],
			comp, props,
			i = list.length;
		while (i--) {
			attr = list[i].slice(0, -1).match(re.pattern);
			name = this._remSlash(attr[re.NAME].trim());
			names[i] = name;
			props = {};
			attrs[name] = props;
			comp = attr[re.COMP];
			if (comp) {
				props.comparison = comp;
				props.value = this._remQuot(this._unescSpecChr(attr[re.VAL].trim()));
			}
		}
		return {
			names: names,
			attrs: attrs
		};
	},

	_apart: function (sel) {
		sel = " " + sel;
		var res = {}, classes = [], attrs = [],
			val, re = this._regExp.component,
			comp = re.pattern.exec(sel);
		while (comp) {
			val = comp[re.VAL].trim();
			switch (comp[re.TYPE]) {
				case "":
					if (val) {
						res.tag = this._remSlash(val);
					}
					break;
				case "#":
					res.id = this._remSlash(val);
					break;
				case ".":
					classes.push(this._remSlash(val));
					break;
				case "[":
					attrs.push(val);
					break;
			}
			comp = re.pattern.exec(sel);
		}
		if (classes.length) {
			res.classes = classes;
		}
		if (attrs.length) {
			attrs = this._attrs(attrs);
			res.attrs = attrs.attrs;
			res.attrNames = attrs.names;
		}
		return res;
	},

	_remSlash: function (str) {
		return str.replace(this._regExp.slash, "$1");
	},

	_remQuot: function (str) {
		var ch = str.charAt(0);
		if (ch == "'" || ch == '"') {
			str = str.slice(1, -1);
		}
		return str;
	},

	_repSpecChr: function (chr) {
		return this._specChr[chr];
	},

	_escSpecChr: function (str) {
		return str.replace(this._regExp.specChr, this._repSpecChr.bind(this));
	},

	_unescSpecChr: function (str) {
		return str.replace(this._regExp.escaped, this._repSpecChr.bind(this));
	},

	_escAttrVal: function (str) {
		var re = this._regExp, esc = this._escSpecChr.bind(this);
		return str.replace(re.quoted, esc).replace(re.dblQuoted, esc);
	},

	_split: function (str) {
		return str.split(this._regExp.composite);
	},

	/**
	 * @private
	 * @param {String} str
	 */
	_process: function (str) {
		return this._split(this._escAttrVal(str)).map(this._apart, this);
	},

	/**
	 * Разбирает селектор на составляющие
	 * @param {String} sel
	 * @return {Array}
	 */
	apart: function (sel) {
		if (!(sel in this._cache)) {
			this._cache[sel] = this._process(sel);
		}
		return this._cache[sel];
		/* Возвращает массив объектов с описанием составляющих селекторов
		[
			{
				[tag]: String,
				[id]: String,
				[classes]: String[],
				[attrNames]: String[],
				[attrs]: {
					attrName: {
						[value]: String,
						[comparison]: String,
					}
				}
			}
		]
		*/
	}

};
