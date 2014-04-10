"use strict";

lib.request.get("MIT-LICENSE.txt").then(function (text) {

	var node = document.createElement("blockquote");
	node.append(text);
	document.body.append(node);

});

//console.log(JSON.stringify(Object.assign({a:1}, {b:2}, {c: 3})));
