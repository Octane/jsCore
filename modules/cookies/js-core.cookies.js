/*
	js-core Cookie module, version 0.0.1
	Copyright (c) 2009 Vlad Zaritovsky
	Released under the MIT License.
	More information: http://www.js-core.ru/
	Todo: add ;domain= and ;path= as optional variables;
	Using:
		- Set a cookie: $.cookies('Name','Value',Expire time in milliseconds);
		- Get stored cookie: $.cookies('Name'), returns null, if cookie does not exist;
		- Remove sored cookie: $.cookies.erase('Name');
*/
core.cookies = function(cookie_name, cookie_value, cookie_expire) {
	return cookie_value === undefined ? core.cookies.get(cookie_name) : core.cookies.set(cookie_name, cookie_value, cookie_expire);
};

core.extend(core.cookies, {
	isEnabled : function() {
		var c = "js-core-test-cookie";
	    var e = (navigator.cookieEnabled)? true : false;
		if (typeof navigator.cookieEnabled == "undefined" && !e) {
			core.cookies.set = c;
			e = (core.cookies.get(c) != null) ? true : false;
			core.cookies.set(c, "", -1);
		}
		return e;
	},
	set: function(cookie_name, cookie_value, cookie_expire) {
		var expire_date = new Date;
		expire_date.setDate(expire_date.getDate() + cookie_expire);
		document.cookie = cookie_name + "=" + escape(cookie_value) + (cookie_expire == null ? "" : ";expires=" + expire_date.toGMTString());
	},
	get: function(cookie_name) {
		var cookie = document.cookie, length = cookie.length;
		if(length) {
			var cookie_start = cookie.indexOf(cookie_name + "=");
			if(cookie_start != -1) {
				var cookie_end = cookie.indexOf(";", cookie_start);
				if(cookie_end == -1) {
					cookie_end = length;
				}
				cookie_start += cookie_name.length + 1;
				return unescape(cookie.substring(cookie_start, cookie_end));
			}
		}
		return null;
	},
	erase: function(cookie_name) {
		core.cookies.set(cookie_name, "", -1);
	}
});
