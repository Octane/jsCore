//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/toJSON
if (!Date.prototype.toJSON) {
	Date.prototype.toJSON = function () {
		//взято из https://github.com/douglascrockford/JSON-js/blob/master/json2.js
		function f(n) {
			//format integers to have at least two digits
			return n < 10 ? "0" + n : n;
		}
		return function () {
			return isFinite(this.valueOf()) ?
				this.getUTCFullYear()     + "-" +
				f(this.getUTCMonth() + 1) + "-" +
				f(this.getUTCDate())      + "T" +
				f(this.getUTCHours())     + ":" +
				f(this.getUTCMinutes())   + ":" +
				f(this.getUTCSeconds())   + "Z" : null;
		};
	}();
}
