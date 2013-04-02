//Element Traversal
//http://www.w3.org/TR/ElementTraversal/
//http://habrahabr.ru/blogs/javascript/54380/
(function () {
	var prop, api, proto = typeof HTMLElement == "undefined" ? (typeof Element == "undefined" ? null : Element.prototype) : HTMLElement.prototype;
	if (!proto) {
		return false;
	}
	if ("firstElementChild" in document.createElement("div")) {
		return false;
	}
	api = {
		//https://developer.mozilla.org/En/DOM/Element.firstElementChild
		firstElementChild: function () {
			var node = this.firstChild;
			while (node && node.nodeType != 1) {
				node = node.nextSibling;
			}
			return node;
		},
		//https://developer.mozilla.org/En/DOM/Element.lastElementChild
		lastElementChild: function () {
			var node = this.lastChild;
			while (node && node.nodeType != 1) {
				node = node.previousSibling;
			}
			return node;
		},
		//https://developer.mozilla.org/En/DOM/Element.nextElementSibling
		nextElementSibling: function () {
			var node = this;
			do {
				node = node.nextSibling
			}
			while(node && node.nodeType != 1);
			return node;
		},
		//https://developer.mozilla.org/En/DOM/Element.previousElementSibling
		previousElementSibling: function () {
			var node = this;
			do {
				node = node.previousSibling;
			}
			while(node && node.nodeType != 1);
			return node;
		},
		//https://developer.mozilla.org/En/DOM/Element.childElementCount
		childElementCount: function () {
			//todo fix IE считает COMMENT_NODE
			return this.children.length;
		}
		//todo https://developer.mozilla.org/En/DOM/Element.children
	};
	try {
		if ("__defineGetter__" in Object) {
			for (prop in api) {
				if (api.hasOwnProperty(prop)) {
					proto.__defineGetter__(prop, api[prop]);
				}
			}
		}
		else if ("defineProperty" in Object) {
			for (prop in api) {
				if (api.hasOwnProperty(prop)) {
					Object.defineProperty(proto, prop, {
						get: api[prop]
					});
				}
			}
		}
	}
	catch (error) {
	}
	return true;
}());