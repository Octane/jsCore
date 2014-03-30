"use strict";

lib.ajax.get("MIT-LICENSE.txt").then(function (data) {

	var pre = document.createElement("pre");
	pre.textContent = data;
	document.body.appendChild(pre);//todo DOM4 methods

}).then(function () {

	//console.log("ajax promise: 1st then");

}).then(function () {

	//console.log("ajax promise: 2nd then");

});
