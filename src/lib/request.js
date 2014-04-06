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
			new Promise(function (resolve) {
				var xhr = new XMLHttpRequest;
				xhr.open("GET", url);
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				resolve(xhr);
			}).then(function (xhr) {
				xhr.onload = function () {
					if (this.status >= 200 && this.status < 400) {
						resolve(xhr.responseText);
					}
					else {
						reject(new Error(xhr.statusText));
					}
				};
				xhr.onerror = function () {
					reject(new Error(xhr.statusText));
				};
				xhr.ontimeout = function () {
					reject(new Error("time is out"));
				};
				xhr.send();
			}, reject);
		}));
	};

	return request;

};
