
if (!Array.isArray) {
	Array.isArray = function (anything) {
		return Object.prototype.toString.call(anything) == "[object Array]";
	};
}

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this) {
				func.call(boundThis, this[i], i, this);
			}
			i++;
		}
	};
}

if (!Array.prototype.map) {
	Array.prototype.map = function (func, boundThis) {
		var i = 0, length = this.length, result = [];
		while (i < length) {
			if (i in this) {
				result[i] = func.call(boundThis, this[i], i, this);
			}
			i++;
		}
		return result;
	};
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (anything) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && this[i] === anything) {
				return i;
			}
			i++;
		}
		return -1;
	};
}

if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function (anything) {
		var i = this.length;
		while (i--) {
			if (i in this && this[i] === anything) {
				return i;
			}
		}
		return -1;
	};
}

if (!Array.prototype.filter) {
	Array.prototype.filter = function (func, boundThis) {
		var i = 0, length = this.length, result = [];
		while (i < length) {
			if (i in this && func.call(boundThis, this[i], i, this)) {
				result.push(this[i]);
			}
			i++;
		}
		return result;
	};
}

if (!Array.prototype.every) {
	Array.prototype.every = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && !func.call(boundThis, this[i], i, this)) {
				return false;
			}
			i++;
		}
		return true;
	};
}

if (!Array.prototype.some) {
	Array.prototype.some = function (func, boundThis) {
		var i = 0, length = this.length;
		while (i < length) {
			if (i in this && func.call(boundThis, this[i], i, this)) {
				return true;
			}
			i++;
		}
		return false;
	};
}

if (!Array.prototype.reduce) {
	Array.prototype.reduce = function (func, initialValue) {
		var i = 0, length = this.length, currentValue;
		if (arguments.length < 2) {
			if (!length) {
				throw new TypeError("Reduce of empty array with no initial value");
			}
			while (i < length) {
				if (i in this) {
					currentValue = this[i];
					i++;
					break;
				}
				i++;
			}
		}
		else {
			currentValue = initialValue;
		}
		while (i < length) {
			if (i in this) {
				currentValue = func(currentValue, this[i], i, this);
			}
			i++;
		}
		return currentValue;
	};
}

if (!Array.prototype.reduceRight) {
	Array.prototype.reduceRight = function (func, initialValue) {
		var i = this.length, currentValue;
		if (arguments.length < 2) {
			if (!this.length) {
				throw new TypeError("Reduce of empty array with no initial value");
			}
			while (i--) {
				if (i in this) {
					currentValue = this[i];
					break;
				}
			}
		}
		else {
			currentValue = initialValue;
		}
		while (i--) {
			if (i in this) {
				currentValue = func(currentValue, this[i], i, this);
			}
		}
		return currentValue;
	};
}
