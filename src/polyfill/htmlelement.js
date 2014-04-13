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
					if (Node.ELEMENT_NODE == node.nodeType) {
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
		return -1 != Array.indexOf(root.querySelectorAll(selector), element);
	}

	function mutationMacro(nodes) {
		var length = nodes.length, i, node, fragment;
		if (1 == length) {
			node = nodes[0];
			if ("string" == typeof node) {
				return document.createTextNode(node);
			}
			return node;
		}
		fragment = document.createDocumentFragment();
		nodes = Array.from(nodes);
		i = 0;
		while (i < length) {
			node = nodes[i];
			if ("string" == typeof node) {
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
			var parentNode = this.parentNode;
			if (parentNode) {
				parentNode.insertBefore(mutationMacro(arguments), this);
			}
		},

		after: function (/* ...nodes */) {
			var parentNode = this.parentNode, nextSibling, nodes;
			if (parentNode) {
				nodes = mutationMacro(arguments);
				nextSibling = this.nextSibling;
				if (nextSibling) {
					parentNode.insertBefore(nodes, nextSibling);
				}
				else {
					parentNode.appendChild(nodes);
				}
			}
		},

		replace: function (/* ...nodes */) {
			var parentNode = this.parentNode;
			if (parentNode) {
				parentNode.replaceChild(mutationMacro(arguments), this);
			}
		},

		remove: function () {
			var parentNode = this.parentNode;
			if (parentNode) {
				parentNode.removeChild(this);
			}
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
				var root, contains;
				if (this === document) {
					//если documentFragment.constructor === document.constructor
					return false;
				}
				root = this.parentNode;
				if (root) {
					if (Node.ELEMENT_NODE == root.nodeType) {
						root = root.ownerDocument;
					}
					return isContains(root, this, selector);
				}
				root = document.createDocumentFragment();
				root.appendChild(this);
				contains = isContains(root, this, selector);
				root.removeChild(this);
			}
		].find(Boolean)

	};

	function implement(key) {
		if (!(key in proto)) {
			proto[key] = api[key];
		}
	}

	Object.keys(api).forEach(implement);

	proto = document.constructor.prototype;
	["query", "queryAll"].forEach(implement);

	proto = document.createDocumentFragment().constructor.prototype;
	["append", "prepend", "query", "queryAll", "matches"].forEach(implement);

};
