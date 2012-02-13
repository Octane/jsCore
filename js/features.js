/**
 * Возможности браузера
 * @namespace
 */
$.features = new function () {
	var node = document.createElement("div");
	this.selectors = "querySelector" in node;
};
