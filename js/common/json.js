//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/JSON
var JSON;
if (!JSON) {
	JSON = {};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/JSON/stringify
if (!JSON.stringify) {
	JSON.stringify = function () {
		//взято из https://github.com/douglascrockford/JSON-js/blob/master/json2.js
		var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			rep, gap, indent, meta = {
				"\b": "\\b",
				"\t": "\\t",
				"\n": "\\n",
				"\f": "\\f",
				"\r": "\\r",
				'"': '\\"',
				"\\": "\\\\"
			};
		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c == "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' : '"' + string + '"';
		}
		function str(key, holder) {
			var i, k, v, length, mind = gap, partial, value = holder[key];
			if (value && typeof value == "object" && typeof value.toJSON == "function") {
				value = value.toJSON(key);
			}
			if (typeof rep == "function") {
				value = rep.call(holder, key, value);
			}
			switch (typeof value) {
				case "string":
					return quote(value);
				case "number":
					return isFinite(value) ? String(value) : "null";
				case "boolean":
				case "null":
					return String(value);
				case "object":
					if (!value) {
						return "null";
					}
					gap += indent;
					partial = [];
					if (Array.isArray(value)) {
						length = value.length;
						for (i = 0; i < length; i += 1) {
							partial[i] = str(i, value) || "null";
						}
						v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
						gap = mind;
						return v;
					}
					if (rep && typeof rep == "object") {
						length = rep.length;
						for (i = 0; i < length; i += 1) {
							k = rep[i];
							if (typeof k == "string") {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ": " : ":") + v);
								}
							}
						}
					} else {
						for (k in value) {
							if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ": " : ":") + v);
								}
							}
						}
					}
					v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
					gap = mind;
					return v;
			}
			return "";
		}
		return function (value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if (typeof space == "number") {
				for (i = 0; i < space; i += 1) {
					indent += " ";
				}
			} else if (typeof space == "string") {
				indent = space;
			}
			rep = replacer;
			if (replacer && typeof replacer != "function" && (typeof replacer != "object" || typeof replacer.length != "number")) {
				throw new Error("JSON.stringify");
			}
			return str("", {
				"": value
			});
		};
	}();
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/JSON/parse
if (!JSON.parse) {
	JSON.parse = function () {
		//взято из https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js 
		var at, ch, text, escapee = {
				'"': '"',
				"\\": "\\",
				"/": "/",
				b: "\b",
				f: "\f",
				n: "\n",
				r: "\r",
				t: "\t"
			};
		function error(m) {
			throw {
				name: "SyntaxError",
				message: m,
				at: at,
				text: text
			};
		}
		function next(c) {
			if (c && c !== ch) {
				error('Expected "' + c + '" instead of "' + ch + '"');
			}
			ch = text.charAt(at);
			at += 1;
			return ch;
		}
		function number() {
			var number, string = "";
			if (ch == "-") {
				string = "-";
				next("-");
			}
			while (ch >= "0" && ch <= "9") {
				string += ch;
				next();
			}
			if (ch == ".") {
				string += ".";
				while (next() && ch >= "0" && ch <= "9") {
					string += ch;
				}
			}
			if (ch == "e" || ch == "E") {
				string += ch;
				next();
				if (ch == "-" || ch == "+") {
					string += ch;
					next();
				}
				while (ch >= "0" && ch <= "9") {
					string += ch;
					next();
				}
			}
			number = +string;
			if (!isFinite(number)) {
				error("Bad number");
			} else {
				return number;
			}
		}
		function string() {
			var hex, i, string = "", uffff;
			if (ch == '"') {
				while (next()) {
					if (ch == '"') {
						next();
						return string;
					} else if (ch == "\\") {
						next();
						if (ch == "u") {
							uffff = 0;
							for (i = 0; i < 4; i += 1) {
								hex = parseInt(next(), 16);
								if (!isFinite(hex)) {
									break;
								}
								uffff = uffff * 16 + hex;
							}
							string += String.fromCharCode(uffff);
						} else if (typeof escapee[ch] == "string") {
							string += escapee[ch];
						} else {
							break;
						}
					} else {
						string += ch;
					}
				}
			}
			error("Bad string");
		}
		function white() {
			while (ch && ch <= " ") {
				next();
			}
		}
		function word() {
			switch (ch) {
			case "t":
				next("t");
				next("r");
				next("u");
				next("e");
				return true;
			case "f":
				next("f");
				next("a");
				next("l");
				next("s");
				next("e");
				return false;
			case "n":
				next("n");
				next("u");
				next("l");
				next("l");
				return null;
			}
			error('Unexpected "' + ch + '"');
		}
		function array() {
			var array = [];
			if (ch == "[") {
				next("[");
				white();
				if (ch == "]") {
					next("]");
					return array;
				}
				while (ch) {
					array.push(value());
					white();
					if (ch == "]") {
						next("]");
						return array;
					}
					next(",");
					white();
				}
			}
			error("Bad array");
		}
		function object() {
			var key, object = {};
			if (ch == "{") {
				next("{");
				white();
				if (ch == "}") {
					next("}");
					return object;
				}
				while (ch) {
					key = string();
					white();
					next(":");
					if (Object.hasOwnProperty.call(object, key)) {
						error('Duplicate key "' + key + '"');
					}
					object[key] = value();
					white();
					if (ch == "}") {
						next("}");
						return object;
					}
					next(",");
					white();
				}
			}
			error("Bad object");
		}
		function value() {
			white();
			switch (ch) {
			case "{":
				return object();
			case "[":
				return array();
			case '"':
				return string();
			case "-":
				return number();
			default:
				return ch >= "0" && ch <= "9" ? number() : word();
			}
		}
		return function (source, reviver) {
			var result;
			text = source;
			at = 0;
			ch = " ";
			result = value();
			white();
			if (ch) {
				error("Syntax error");
			}
			return typeof reviver == "function" ? (function walk(holder, key) {
				var k, v, value = holder[key];
				if (value && typeof value == "object") {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}({
				"": result
			}, "")) : result;
		};
	}();
}
