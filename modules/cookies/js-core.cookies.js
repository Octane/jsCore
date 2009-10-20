/*
	js-core Cookie module, version 0.0.1
	Copyright (c) 2009 Vlad Zaritovsky
	Released under the MIT License.
	More information: http://www.js-core.ru/
	Using:
			- Set a cookie: $.cookies.set('Name','Value',Expire time in milliseconds)
			- Get stored cookie: $.cookies.get('Name'), returns null, if cookie does not exist;
			- Remove sored cookie: $.cookies.erase('Name');
*/

core.cookies = function() {
	if(this.cookies) return new this.cookies();
}

core.cookies.set = function(cookie_name, cookie_value, cookie_expire) {
	var expire_date=new Date();
	expire_date.setDate(expire_date.getDate()+cookie_expire);
	document.cookie=cookie_name+"="+escape(cookie_value)+((cookie_expire==null) ? "" : ";expires="+expire_date.toGMTString());
}

core.cookies.get = function(cookie_name) {
	if (document.cookie.length>0) {
		if ((cookie_start=document.cookie.indexOf(cookie_name + "="))!=-1)
		{
			if ((cookie_end=document.cookie.indexOf(";",cookie_start))==-1) cookie_end=document.cookie.length;
			return unescape(document.cookie.substring((cookie_start += (cookie_name.length + 1)),cookie_end));
		}
	}
	return null;
}

core.cookies.erase = function(cookie_name) {
	core.cookies.set(cookie_name,"",-1);
}
