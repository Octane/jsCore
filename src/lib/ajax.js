"use strict";

lib.ajax = {

	//todo

	//returns promise
	get: function (url) {
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
		return Promise.resolve(new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest;
			xhr.open("GET", url);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.onload = function () {
				resolve(xhr.responseText);
			};
			xhr.onerror = function () {
				reject(Error(xhr.statusText));
			};
			xhr.send();
		}));
	}

};
