"use strict";

function StaticDOMStringMap() {}

"dataset" in document.documentElement || new function () {

	//simple implementation: the new property will not create an attribute

	function toUpperCase(str) {
		return str.charAt(1).toUpperCase();
	}

	function attrToPropName(attrName) {
		return attrName.substr(5).replace(/-./g, toUpperCase);
	}

	function attrToPropDesc(attr) {
		return {
			get: function () {
				return attr.value;
			},
			set: function (value) {
				attr.value = String(value);
			}
		};
	}

	function fillDataset(dataset, attrs) {
		Array.forEach(attrs, function (attr) {
			var attrName = attr.name.toLowerCase();
			if (attrName.startsWith("data-")) {
				Object.defineProperty(dataset, attrToPropName(attrName), attrToPropDesc(attr));
			}
		});
		return dataset;
	}

	Object.defineProperty(HTMLElement.prototype, "dataset", {
		get: function () {
			return fillDataset(new StaticDOMStringMap, this.attributes);
		}
	});

};

"classList" in document.documentElement || new function () {

	//todo InvalidCharacterError, IE11 several arguments support

	function DOMTokenList(getTokens, onChange) {
		this.getTokens = getTokens;
		this.onChange = onChange;
	}

	Object.assign(DOMTokenList.prototype, {

		empty: function () {
			var i = this.length;
			while (i--) {
				delete this[i];
			}
			this.length = 0;
		},

		push: function (tokens) {
			Array.prototype.push.apply(this, tokens);
		},

		update: function () {
			this.empty();
			this.push(this.getTokens());
		},

		item: function (index) {
			this.update();
			return this[index] || null;
		},

		add: function () {
			var length;
			this.update();
			length = this.length;
			Array.forEach(arguments, function (token) {
				if (Array.indexOf(this, token) == -1) {
					Array.push(this, token);
				}
			}, this);
			if (length != this.length) {
				this.onChange();
			}
		},

		remove: function () {
			var length;
			this.update();
			length = this.length;
			Array.forEach(arguments, function (token) {
				var index = Array.indexOf(this, token);
				if (index != -1) {
					Array.splice(this, index, 1);
				}
			}, this);
			if (length != this.length) {
				this.onChange();
			}
		},

		toggle: function (token, force) {
			this.update();
			if (force === false || this.contains(token)) {
				this.remove(token);
				return false;
			}
			this.add(token);
			return true;
		},

		contains: function (token) {
			this.update();
			return Array.indexOf(this, token) != -1;
		},

		toString: function () {
			return Array.join(this, " ");
		}

	});

	function getClasses(className) {
		className = className.trim();
		if (className.length) {
			return className.split(/\s\s*/);
		}
		return [];
	}

	Object.defineProperty(HTMLElement.prototype, "classList", {
		get: function () {
			var element = this;
			if (!element._classList) {
				element._classList = new DOMTokenList(
					function () {
						return getClasses(element.className);
					},
					function () {
						//this → element._classList
						element.className = this.toString();
					}
				);
			}
/*
			//Убрал обновление DOMTokenList по следующим причинам:
			//1. IE11 не обновляет его, когда изменяется свойство className.
			//2. Применение Mutation Events является устаревшим.
			//3. Во избежание утечек памяти.
			element.addEventListener("DOMAttrModified", function (event) {
				if (event.attrName.toLowerCase() == "class") {
					element._classList.update();
				}
			}, false);
*/
			element._classList.update();
			return element._classList;
		}
	});

};

//Element traversal polyfill
"children" in document.createDocumentFragment() || new function () {

	var proto, api = {

		firstElementChild: function () {
			var node = this.firstChild;
			while (node && node.nodeType != 1) {
				node = node.nextSibling;
			}
			return node;
		},

		lastElementChild: function () {
			var node = this.lastChild;
			while (node && node.nodeType != 1) {
				node = node.previousSibling;
			}
			return node;
		},

		nextElementSibling: function () {
			var node = this;
			do {
				node = node.nextSibling;
			}
			while(node && node.nodeType != 1);
			return node;
		},

		previousElementSibling: function () {
			var node = this;
			do {
				node = node.previousSibling;
			}
			while(node && node.nodeType != 1);
			return node;
		},

		childElementCount: function () {
			return this.children.length;
		},

		children: new function () {

			function StaticHTMLCollection() {}

			StaticHTMLCollection.prototype.item = function (index) {
				return this[index] || null;
			};

			return function () {
				var i = 0, node, nodes = this.childNodes, length = nodes.length,
					j = 0, elements = new StaticHTMLCollection;
				while (i < length) {
					node = nodes[i];
					if (node.nodeType == Node.ELEMENT_NODE) {
						elements[j++] = node;
					}
					i++;
				}
				elements.length = j;
				return elements;
			};

		}

	};

	function defineGetter(key) {
		if (!(key in proto)) {
			Object.defineProperty(proto, key, {
				get: api[key]
			});
		}
	}

	proto = HTMLElement.prototype;
	Object.keys(api).forEach(defineGetter);

	[
		document.constructor,
		document.createDocumentFragment().constructor
	].forEach(function (Constructor) {
		proto = Constructor.prototype;
		[
			"firstElementChild", "lastElementChild",
			"childElementCount", "children"
		].forEach(defineGetter);
	});

};

//DOM4 http://www.w3.org/TR/dom/#element
"append" in document.createDocumentFragment() || new function () {

	//todo HierarchyRequestError

	var api, proto = HTMLElement.prototype;

	function isContains(root, element, selector) {
		return Array.indexOf(root.querySelectorAll(selector), element) != -1;
	}

	function mutationMacro(nodes) {
		var length = nodes.length, i, node, fragment;
		if (length == 1) {
			node = nodes[0];
			if (typeof node == "string") {
				return document.createTextNode(node);
			}
			return node;
		}
		fragment = document.createDocumentFragment();
		nodes = Array.from(nodes);
		i = 0;
		while (i < length) {
			node = nodes[i];
			if (typeof node == "string") {
				node = document.createTextNode(node);
			}
			fragment.appendChild(node);
			i++;
		}
		return fragment;
	}

	api = {

		before: function (/* ...nodes */) {
			//todo IE8 removedNode.parentNode != null
			this.parentNode.insertBefore(mutationMacro(arguments), this);
		},

		after: function (/* ...nodes */) {
			var parentNode = this.parentNode,
				nextSibling = this.nextSibling,
				nodes = mutationMacro(arguments);
			if (nextSibling) {
				parentNode.insertBefore(nodes, nextSibling);
			}
			else {
				parentNode.appendChild(nodes);
			}
		},

		replace: function (/* ...nodes */) {
			this.parentNode.replaceChild(mutationMacro(arguments), this);
		},

		remove: function () {
			this.parentNode.removeChild(this);
		},

		append: function (/* ...nodes */) {
			this.appendChild(mutationMacro(arguments));
		},

		prepend: function () {
			this.insertBefore(mutationMacro(arguments), this.firstChild);
		},

		query: function (selector) {
			return this.querySelector(selector);
		},

		queryAll: function (selector) {
			return this.querySelectorAll(selector);
		},

		matches: [
			proto.matchesSelector,
			proto.oMatchesSelector,
			proto.msMatchesSelector,
			proto.mozMatchesSelector,
			proto.webkitMatchesSelector,
			function (selector) {
				var root = this.parentNode, contains;
				if (root) {
					if (root.nodeType == Node.ELEMENT_NODE) {
						root = root.ownerDocument;
					}
					return isContains(root, this, selector);
				}
				root = document.createDocumentFragment();
				root.appendChild(this);
				contains = isContains(root, this, selector);
				root.removeChild(this);
				return contains;
			}
		].find(Boolean)

	};

	function implement(key) {
		if (!(key in proto)) {
			proto[key] = api[key];
		}
	}

	Object.keys(api).forEach(implement);

	proto = document.constructor;
	["query", "queryAll"].forEach(implement);

	proto = document.createDocumentFragment().constructor.prototype;
	["append", "prepend", "query", "queryAll", "matches"].forEach(implement);

};
