"use strict";

lib.ajax.get("MIT-LICENSE.txt").then(function (data) {

	var pre = document.createElement("pre");
	pre.append(data);
	document.body.append(pre);//todo DOM4 methods

}).then(function () {

	//console.log("ajax promise: 1st then");

}).then(function () {

	//console.log("ajax promise: 2nd then");

});


lib.event.when("click", "body, pre, h1").then(function (event) {

	document.body.prepend("x = " + event.pageX, ", y = " + event.pageY);

});
