//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
//http://blog.stevenlevithan.com/archives/faster-trim-javascript
//http://perfectionkills.com/chr-deviations/
(function () {

	//взято из https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
	//http://perfectionkills.com/whitespace-deviations/
	var chr = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
	if (!String.prototype.trim || chr.trim()) {
		chr = "[" + chr + "]";
		//http://blog.stevenlevithan.com/archives/faster-trim-javascript
		var left = new RegExp("^" + chr + chr + "*"),
			right = new RegExp(chr + chr + "*$");
		String.prototype.trim = function () {
			return this.replace(left, "").replace(right, "");
		};
	}

}());
