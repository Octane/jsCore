
//IE8 children.length fix (exclude COMMENT_NODE)
(function () {
	var node = document.createElement("div");
	node.append(document.createComment("test"));
	return node.children.length; //→ 1 in IE8
}()) && Object.defineProperty(HTMLElement.prototype, "children", {
	get: Object.getOwnPropertyDescriptor(document.constructor.prototype, "children").get
});
