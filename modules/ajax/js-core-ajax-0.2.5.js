/* js-core AJAX module, version 0.2.5
   Copyright (c) 2009 Dmitry Korobkin
   Released under the MIT License.
   More information: http://www.js-core.ru/
	Warning: do not use timeout for more then 2 XHR at one time!
*/
core.ajax = function() {
	if(this.ajax) return new this.ajax();
	this.xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
};
core.ajax.type = {
	html: 'text/html',
	text: 'text/plain',
	xml: 'application/xml, text/xml',
	json: 'application/json, text/javascript',
	script: 'text/javascript, application/javascript',
	'default': 'application/x-www-form-urlencoded'
};
core.ajax.accept = '*\/*';
core.ajax.prototype.open = function(params) {
	core.extend(this, {
		method: params.method || 'GET',
		url: params.url || location.href,
		async: params.async !== false,
		user: params.user || null,
		password: params.password || null,
		params: params.params || null,
		processData: params.processData === true,
		timeout: params.timeout || 0,
		contentType: core.ajax.type[params.contentType] || core.ajax.type['default'],
		dataType: core.ajax.type[params.dataType] ? core.ajax.type[params.dataType] + ', *\/*' : core.ajax.accept,
		requestHeaders: params.requestHeaders || null,
		success: params.success,
		error: params.error
	});
	if(this.params) {
		var params = [], process = this.process;
		core.forEach(this.params, function(key, value) {
			params.push([key, '=', process ? encodeURIComponent(value) : value].join(''));
		});
		this.params = params.join('&');
	}
	try {
		this.xhr.open(this.method, this.method == 'GET' && this.params ? this.url + '?' + this.params : this.url, this.async, this.user, this.password);
		this.xhr.setRequestHeader('Accept', this.dataType);
		this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		this.xhr.setRequestHeader('Content-Type', this.contentType);
		var ajax = this;
		if(this.requestHeaders) core.forEach(this.requestHeaders, function(key, value) {
			ajax.xhr.setRequestHeader(key, value);
		});
		this.xhr.onreadystatechange = function() {
			if(ajax.xhr.readyState == 4) {
				if(ajax.xhr.status == 200 || ajax.xhr.status == 0 && ajax.success) ajax.success(ajax.xhr.responseText);
				else if(ajax.error && !ajax.aborted) ajax.error(ajax.xhr.statusText);
			}
		};
		this.xhr.send(this.params);;
		if(this.async && this.timeout) setTimeout(function() {
			if(ajax.xhr.readyState != 4) {
				ajax.aborted = true;
				ajax.xhr.abort();
				if(ajax.error) ajax.error('Time is out');
			}
		}, this.timeout);
	}
	catch(error) {
		if(this.error) this.error(error);
	}
};
core.get = function(params, success, error) {
	new core.ajax().open(core.extend(params, {success: success, error: error}));
	return this;
};
core.post = function(params, success, error) {
	new core.ajax().open(core.extend(params, {method: 'POST', success: success, error: error}));
	return this;
};
core.getJSON = function(params, callback, error) {
	new core.ajax().open(core.extend(params, {dataType: 'json', success: function(response) {
		try {
			callback(eval('(' + response + ')'));
		}
		catch(error) {
			if(this.error) this.error(error);
		}
	}, error: error}));
	return this;
};
core.prototype.load = function(params, success, error) {
	var _this = this;
	new core.ajax().open(core.extend(params, {success: function(response) {
		_this.html(response);
		if(success) success.call(_this.node, response, this.xhr);
	}, error: function(response) {
		if(error) error.call(_this.node, response, this.xhr);
	}}));
	return this;
};