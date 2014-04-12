"use strict";

lib.request.get("MIT-LICENSE.txt").then(function (xhr) {

	var node = document.createElement("blockquote");
	node.append(xhr.responseText);
	document.body.append(node);

});
