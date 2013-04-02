//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
	Function.prototype.bind = function () {
		function newApply(Constructor, args) {
			var i = 0, len = args.length, argNames = [];
			while (i < len) {
				argNames.push("arg" + i);
				i++;
			}
			argNames = argNames.join(",");
			return Function("Constructor", argNames, "return new Constructor(" + argNames + ")").apply(window, [Constructor].concat(args));
		}
		return function (boundThis) {
			if (typeof this != "function") {
				throw new TypeError("Function.prototype.bind called on non-function");
			}
			var targetFunc = this, boundArgs = Array.prototype.slice.call(arguments, 1);
			function boundFunc() {
				var allArgs, len;
				function NOP() {}
				if (boundFunc._protoMagic) {
					boundFunc._protoMagic = false;
					NOP.prototype = this;
					NOP.prototype.constructor = targetFunc;
					return new NOP;
				}
				else {
					allArgs = boundArgs.concat(Array.prototype.slice.call(arguments));
					len = allArgs.length;
				}
				//в strict режиме this может быть undefined
				if (this && this.constructor == boundFunc) {
					boundFunc._protoMagic = true;
					NOP.prototype = len > 1 ? newApply(targetFunc, allArgs) : (len ? new targetFunc(allArgs[0]) : new targetFunc);
					boundFunc.prototype = new NOP;
					boundFunc.prototype.constructor = boundFunc;
					return new boundFunc;
				}
				return len > 1 ? targetFunc.apply(boundThis, allArgs) : (len ? targetFunc.call(boundThis, allArgs[0]) : targetFunc.call(boundThis));
			}
			boundFunc._protoMagic = false;
			return boundFunc;
		};
	}();
}
