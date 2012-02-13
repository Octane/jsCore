//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
	Array.isArray = function (obj) {
		return Object.prototype.toString.call(obj) == "[object Array]";
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(func, boundThis) {
		var i = 0, len = this.length;
		while (i < len) {
			if (i in this) {
				func.call(boundThis, this[i], i, this);
			}
			i++;
		}
	};
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
if (!Array.prototype.map) {
	Array.prototype.map = function (func, boundThis) {
		var i = 0, len = this.length, res = [];
		while (i < len) {
			if (i in this) {
				res[i] = func.call(boundThis, this[i], i, this);
			}
			i++;
		}
		return res;
	};
}
