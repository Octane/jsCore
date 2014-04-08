"use strict";

var fd = new FormData;

fd.append("key1", "value1");
fd.append("key2", "value2");

//lib.request.get("MIT-LICENSE.txt").then(function (data) {
lib.request({
	method:   "POST",
	url:      "MIT-LICENSE.txt",
	data:     fd,
	userName: "",
	password: "",
	timeout:  0,
	async:    true,
	caching:  false,
	credentials: false,
	mimeType: "",
	headers: {
		"Accept": "*/*"
	}
}).then(function (data) {
	var pre = document.createElement("pre");
	pre.append(data);
	document.body.append(pre);
}, function (reason) {
	var pre = document.createElement("pre");
	pre.append(reason.message);
	document.body.append(pre);
});

1 && new function () {

	var xhr = new XMLHttpRequest, fd = new FormData(document.querySelector("form"));

	xhr.open("POST", "/");
	xhr.setRequestHeader("Content-Type", "multipart/form-data");
	xhr.send(fd);

	//console.log("send");

};

1 && new function () {

	lib.request.post({data: new FormData});

};
