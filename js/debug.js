/**
 * consolejs 1.0 
 * © Dmitry Korobkin
 * MIT License
 * http://code.google.com/p/consolejs/
 */

/**
 * Консоль (закрывается по dblclick)
 * @require Function.prototype.bind, Array.isArray, Array.prototype.forEach, Object.keys
 */
var $console = {

	ELEMENT_NODE: 1,
	TEXT_NODE:    3,
	COMMENT_NODE: 8,

	html: [
		'<div id="{%containerId%}" class="{%hiddenClass%}" action="">',
			'<pre class="{%messageClass%}"></pre>',
		'</div>'
	].join(""),

	replacements: {
		containerId:  "console-container",
		messageClass: "console-message",
		hiddenClass:  "hidden",
		errorClass:   "error"
	},

	separator: ", ",
	funcNamePattern: /^\s*function\s+(.+?)\s*\(/,
	escapePattern: /["\n\r\t\s\u00A0]/g,
	escapeChar: {
		//'"':  '\\"',
		"\n": "\\n",
		"\r": "\\r",
		"\t": "\\t",
		"\s": "\\s",
		"\u00A0": "\\u00A0"
	},

	hideOn: "dblclick",

	logLevel: 10,
	_logLevel: 0,

	_hidden:   true,
	_firstRun: true,

	_container: null,
	_message:   null,

	init: function () {
		this._processTemplate();
		this._createElements();
		this._initEvents();
		this._escape = this._escape.bind(this);
		this.log = this.log.bind(this);
		return this;
	},

	_processTemplate: function () {
		Object.keys(this.replacements).forEach(this._replace.bind(this));
	},

	_createElements: function () {
		var node = document.createElement("div");
		node.innerHTML = this.html;

		this._container = node.firstChild;
		this._message = this._container.firstChild;

		this._hide();
		document.body.appendChild(this._container);
	},

	_initEvents: function () {
		this._container["on" + this.hideOn] = this._hide.bind(this);
	},

	_replace: function (name) {
		this.html = this.html.replace("{%" + name + "%}", this.replacements[name]);
	},

	_escape: function (character) {
		return this.escapeChar[character] || character;
	},

	_getFuncName: function (func) {
		var name, match;
		if (func.name) {
			name = func.name;
		}
		else {
			match = func.toString().match(this.funcNamePattern);
			name = match ? match[1] : "anonymous";
		}
		return name;
	},

	_logArray: function (array) {
		var i = 0, len = array.length, msg = [];
		while (i < len) {
			if (i) {
				msg.push(", ");
			}
			if (i in array) {
				this._logLevel++;
				msg.push(this._log(array[i]));
				this._logLevel--;
			}
			else {
				msg.push("░");
			}
			i++;
		}
		return "[" + msg.join("") + "]";
	},

	_logString: function (str) {
		return "`" + str.replace(this.escapePattern, this._escape) + "`";
	},

	_logFunction: function (func) {
		return this._getFuncName(func) + "()";
	},

	_logObject: function (obj) {
		var i = 0, key, value, keys = Object.keys(obj),
			len = keys.length, msg = [], err;
		while (i < len) {
			if (i) {
				msg.push(", ");
			}
			key = keys[i];
			msg.push(key + ": ");
			err = false;
			try {
				//в IE8 иногда возникает ошибка, напиример, при попытке обратиться
				//к document.documentElement.childNodes.constructor.toString будет
				//ошибка: "Объект не поддерживает это свойство или метод"
				value = obj[key];
			}
			catch (error) {
				err = true;
				msg.push(this._logString(error.message));
			}
			if (!err) {
				this._logLevel++;
				msg.push(this._log(value));
				this._logLevel--;
			}
			i++;
		};
		return "{" + msg.join("") + "}";
	},

	_logRegExp: function (re) {
		return "/" + re.source + "/";
	},

	_logDOM: function (node) {
		var i, len, attr, attrs,
			type = node.nodeType,
			msg = [node.nodeName];
		if (type == this.ELEMENT_NODE) {
			attrs = node.attributes;
			len = attrs.length;
			i = 0;
			while (i < len) {
				attr = attrs[i];
				if (attr.specified) {
					msg.push(attr.name + '=' + this._logString(String(attr.value)));
				}
				i++;
			}
		}
		else if(type == this.TEXT_NODE || type == this.COMMENT_NODE) {
			msg.push(this._logString(String(node.nodeValue)));
		}
		return "<" + msg.join(" ") + ">";
	},

	_log: function (arg) {
		var type = typeof arg;
		if (type == "string") {
			return this._logString(arg);
		}
		if (type == "function") {
			return this._logFunction(arg);
		}
		if (Array.isArray(arg)) {
			if (this._logLevel > this.logLevel) {
				return "[…]";
			}
			return this._logArray(arg);
		}
		if (Object(arg) === arg) {
			if (window === arg) {
				return "window";
			}
			if (arg instanceof RegExp) {
				return this._logRegExp(arg);
			}
			if (!(arg instanceof Object) && isFinite(arg.nodeType)) {
				//DOM-элементы в IE<9
				return this._logDOM(arg);
			}
			if (typeof Node != "undefined" && (arg instanceof Node)) {
				return this._logDOM(arg);
			}
			if (typeof HTMLElement != "undefined" && (arg instanceof HTMLElement)) {
				return this._logDOM(arg);
			}
			if (typeof Element != "undefined" && (arg instanceof Element)) {
				return this._logDOM(arg);
			}
			if (this._logLevel > this.logLevel) {
				return "{…}";
			}
			return this._logObject(arg);
		}
		return String(arg);
	},

	_showMessage: function (msg) {
		var messageContainer;
		if (this._hidden) {
			this._show();
		}
		if (this._firstRun) {
			this._firstRun = false;
			messageContainer = this._message;
		}
		else {
			messageContainer = this._message.cloneNode(false);
		}
		messageContainer.appendChild(document.createTextNode(msg));
		this._container.appendChild(messageContainer);
		this._container.scrollTop = this._container.scrollHeight;
		return messageContainer;
	},

	_show: function () {
		this._hidden = false;
		this._container.className = "";
	},

	_hide: function () {
		this._hidden = true;
		this._container.className = this.replacements.hiddenClass;
	},

	log: function () {
		var i = 0, len = arguments.length, msg = [];
		if (len) {
			while (i < len) {
				this._logLevel = 0;
				msg.push(this._log(arguments[i]));
				i++;
			}
			this._showMessage(msg.join(this.separator));
		}
		else {
			this.error("no arguments");
		}
	},

	error: function (msg) {
		this._showMessage(msg).className += " " + this.replacements.errorClass;
	}

};

$console.init();

if (typeof console == "undefined") {
	window.console = $console;
}

/**
 * Командная строка
 * @require Function.prototype.bind, Array.prototype.forEach, Object.keys
 */
({

	html: [
		'<form id="{%containerdId%}" class="{%hiddenClass%}" action="">',
			'<fieldset>',
				'<input id="{%codeId%}" type="text">',
				'<input id="{%togglerId%}" type="button" value="≡">',
			'</fieldset>',
		'</form>'
	].join(""),

	replacements: {
		containerdId: "command-line-container",
		togglerId:    "command-line-toggler",
		codeId:       "command-line-code",
		hiddenClass:  "hidden"
	},

	evalPattern: "try{$console.log(eval(unescape('{%code%}')))}catch(e){$console.error(e.message)}",

	evalOn:   "submit",
	toggleOn: "click",

	_hidden: true,

	_container: null,
	_toggler:   null,
	_code:      null,

	init: function () {
		this._processTemplate();
		this._createElements();
		this._initEvents();
	},

	_processTemplate: function () {
		Object.keys(this.replacements).forEach(this._replace.bind(this));
	},

	_createElements: function () {
		var node = document.createElement("div");
		node.innerHTML = this.html;

		this._container = node.firstChild;
		document.body.appendChild(this._container);

		this._code = document.getElementById(this.replacements.codeId);
		this._toggler = document.getElementById(this.replacements.togglerId);
	},

	_initEvents: function () {
		this._container["on" + this.evalOn] = this._evalCode.bind(this);
		this._toggler["on" + this.toggleOn] = this._toggle.bind(this);
	},

	_replace: function (name) {
		this.html = this.html.replace("{%" + name + "%}", this.replacements[name]);
	},


	_getCode: function () {
		return this._code.value;
	},

	_evalCode: function () {
		var code = this._getCode();
		if (code) {
			$console.log("command line: " + code);
			var script = document.createElement("script");
			script.text = this.evalPattern.replace("{%code%}", escape(code));
			document.body.appendChild(script);
			document.body.removeChild(script);
		}
		return false;
	},

	_toggle: function () {
		if (this._hidden) {
			this._hidden = false;
			this._container.className = "";
			this._code.focus();
		}
		else {
			this._hidden = true;
			this._container.className = this.replacements.hiddenClass;
		}
	}

}).init();
