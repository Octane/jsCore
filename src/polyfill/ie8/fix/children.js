
//IE8 children.length fix (exclude COMMENT_NODE)
(function () {

	var node = document.createElement("div");
	node.appendChild(document.createComment("test"));
	return node.children.length;

}()) && new function () {

	Object.defineProperty(HTMLElement.prototype, "children", {
		get: Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "children").get
	});

};
