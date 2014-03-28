"use strict";

lib.ajax = {

	//todo

	//returns promise
	get: function (params) {
		/*
			params = {
				method:   string,
				url:      string,
				data:     string|object,
				userName: string,
				password: string,
				timeout:  number,
				async:    boolean
			}
		*/
		var xhr = new XMLHttpRequest;
		xhr.open("GET", params.url, true);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		return new Promise(function (resolve, reject) {
			//todo fix IE8 XHMLHttpRequest events
			xhr.onload = function () {
				resolve(xhr.responseText);
			};
			xhr.onerror = function () {
				reject(Error(xhr.statusText));
			};
			xhr.send(null);
		});
	}

};
