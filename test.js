"use strict";

lib.request.get("MIT-LICENSE.txt").then(function (xhr) {

	var node = document.createElement("blockquote");
	node.append(xhr.responseText);
	document.body.append(node);

});

0 && new function () {
	var obj = Object.create({}, {x:{value: 5}});
	obj[0] = 0;
	console.log(obj.hasOwnProperty(0));
	console.log(obj.propertyIsEnumerable(0));
	console.log(Object.getOwnPropertyDescriptor(obj, "0"));
	console.log(Object.create(null) instanceof Object);
}
