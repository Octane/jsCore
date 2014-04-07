
//IE8 children.length fix (exclude COMMENT_NODE)
(function () {

	var node = document.createElement("div");
	node.appendChild(document.createComment("test"));
	return node.children.length;

}()) && Object.defineProperty(HTMLElement.prototype, "children", {
	get: Object.getOwnPropertyDescriptor(document.constructor.prototype, "children").get
});
