"use strict";

lib.request = new function () {

	var getRndQueryVal = new function () {
		var uniqueValues = {};
		return function () {
			var value = Math.random().toString().slice(2);
			if (!uniqueValues[value]) {
				uniqueValues[value] = 1;
				return value;
			}
			return getRndQueryVal();
		};
	};

	function toQueryParam(key, value) {
		return encodeURIComponent(key) + "=" + encodeURIComponent(value);
	}

	function toQueryString(object) {
		return Object.keys(object).reduce(function (result, key) {
			result.push(toQueryParam(key, object[key]));
			return result;
		}, []).join("&");
	}

	function unbind(xhr) {
		xhr.onload = null;
		xhr.onerror = null;
		xhr.ontimeout = null;
	}

	function request(params) {
		/*
			params = {
				method:   String,
				url:      String,
				data:     String|Object|FormData,
				userName: String,
				password: String,
				timeout:  Number,
				async:    Boolean,
				caching:  Boolean,
				credentials: Boolean,
				mimeType: String,
				headers: Object
			}
		*/
		var method = (params.method || "GET").toUpperCase(),
			url = params.url || location.href,
			data = params.data,
			userName = params.userName || "",
			password = params.password || "",
			timeout = params.timeout || 0,
			async = params.async !== false,
			caching = params.caching !== false,
			credentials = params.credentials === true,
			mimeType = params.mimeType,
			headers = {
				"X-Requested-With": "XMLHttpRequest"
			};

		if (Object(data) === data) {
			if (data instanceof FormData) {
				headers["Content-Type"] = "multipart/form-data";
			}
			else {
				data = toQueryString(data);
			}
		}
		if (method == "POST") {
			headers["Content-Type"] = headers["Content-Type"] || "application/x-www-form-urlencoded; charset=UTF-8";
		}
		else {
			if (!caching) {
				url += "?no-cache=" + getRndQueryVal();
			}
			if (typeof data == "string") {
				url += (caching ? "?" : "&") + data;
			}
			data = null;
		}
		if (params.headers) {
			Object.assign(headers, params.headers);
		}

		return Promise.resolve(new Promise(function (resolve, reject) {

			function onLoad() {
				unbind(this);
				if (this.status >= 200 && this.status < 400) {
					resolve(this.responseText);
				}
				else {
					reject(new Error(this.statusText));
				}
			}
			function onError() {
				unbind(this);
				reject(new Error(this.statusText));
			}
			function onTimeout() {
				unbind(this);
				reject(new Error("time is out"));
			}

			new Promise(function (resolve) {
				var xhr = new XMLHttpRequest;
				xhr.open(method, url, async, userName, password);
				if (timeout) {
					xhr.timeout = timeout;
				}
				if (credentials) {
					xhr.withCredentials = true;
				}
				if (mimeType) {
					xhr.overrideMimeType(mimeType);
				}
				Object.keys(headers).forEach(function (key) {
					xhr.setRequestHeader(key, headers[key]);
				});
				resolve(xhr);
			}).then(function (xhr) {
				xhr.onload = onLoad;
				xhr.onerror = onError;
				if (timeout) {
					xhr.ontimeout = onTimeout;
				}
				xhr.send(data);
			}, reject);

		}));

	}

	Object.assign(request, {

		toQueryParam: toQueryParam,
		toQueryString: toQueryString,

		get: function (params) {
			if (typeof params == "string") {
				params = {url: params};
			}
			params.method = "GET";
			return request(params);
		},

		post: function (params) {
			params.method = "POST";
			return request(params);
		},

		json: function (params) {
			return this.get(params).then(JSON.parse);
		},

		jsonp: function (params) {
			return this.script(params);
		},

		script: function (params) {
			/*
				params = {
					url:     String,
					data:    String|Object,
					caching: Boolean
				}
			*/
			var url, data, caching; //todo timeout
			if (typeof params == "string") {
				params = {url: params};
			}
			url = params.url || location.href;
			data = params.data;
			caching = params.caching !== false;
			if (Object(data) === data) {
				data = toQueryString(data);
			}
			if (!caching) {
				url += "?no-cache=" + getRndQueryVal();
			}
			if (typeof data == "string") {
				url += (caching ? "?" : "&") + data;
			}
			return Promise.resolve(new Promise(function (resolve, reject) {
				document.head.append(Object.assign(document.createElement("script"), {
					onload: function () {
						unbind(this);
						this.remove();
						resolve();
					},
					onerror: function () {
						unbind(this);
						this.remove();
						reject(new Error("Could not load script"));
					},
					async: true,
					defer: true,
					src: url
				}));
			}));
		}

	});

	return request;

};
