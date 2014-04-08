"use strict";

lib.request.get("MIT-LICENSE.txt").then(function (text) {

	var node = document.createElement("blockquote");
	node.append(text);
	document.body.append(node);

});
