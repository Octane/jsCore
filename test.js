"use strict";

lib.request.get("MIT-LICENSE.txt").then(function (data) {
	var pre = document.createElement("pre");
	pre.append(data);
	document.body.append(pre);
}, function (reason) {
	var pre = document.createElement("pre");
	pre.append(reason.message);
	document.body.append(pre);
});
