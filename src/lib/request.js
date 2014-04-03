"use strict";

lib.request = new function () {

	function request(params) {
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
	}

	request.get = function (url) {
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
	};

	return request;

};
