console.clear();

/**
 * Promise polyfill
 */
var Promise = window.Promise || new function () {

	console.log("promise polyfill");

	function Promise(resolver) {
	}

	Object.assign(Promise, {

		resolve: function (value) {
			return new Promise(function(resolve) {
				resolve(value);
			});
		},

		reject: function (reason) {
			return new Promise(function (resolve, reject) {
				reject(reason);
			});
		},

		cast: function () {
		},

		race: function () {
		},

		all: function () {
		}

	});

	Object.assign(Promise.prototype, {

		then: function (onFulfilled, onRejected) {
		},

		"catch": function (onRejected) {
			return then(undefined, onRejected);
		}

	});

	return Promise;

};

new Promise(function (resolve, reject) {

});

//setImmediate
new function () {
	function si1(text) {
		//throw Error(text);
	}
	function si2(a, b, c, text) {
		console.log(text);
	}

	var si1id = setImmediate(si1, "testError");
	var si2id = setImmediate(si2, null, null, null, "testMessage");
	clearImmediate(si2id);

	var textNode = document.createTextNode("");
	document.body.appendChild(textNode);
	document.addEventListener("mousemove", function (event) {
		setImmediate(function (x, y) {
			textNode.nodeValue = x + ", " + y;
		}, event.pageX, event.pageY);
	}, false);
}

//Array.prototype.copyWithing
new function () {

console.log("copyWithin test: " + [

	[1, 2, 3, 4, 5].copyWithin(0, 3).toString() == [4, 5, 3, 4, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(1, 3).toString() == [1, 4, 5, 4, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(1, 2).toString() == [1, 3, 4, 5, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(2, 2).toString() == [1, 2, 3, 4, 5].toString(),

	[1, 2, 3, 4, 5].copyWithin(0, 3, 4).toString() == [4, 2, 3, 4, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(1, 3, 4).toString() == [1, 4, 3, 4, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(1, 2, 4).toString() == [1, 3, 4, 4, 5].toString(),

	[1, 2, 3, 4, 5].copyWithin(0, -2).toString()      == [4, 5, 3, 4, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(0, -2, -1).toString()  == [4, 2, 3, 4, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(-4, -3, -2).toString() == [1, 3, 3, 4, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(-4, -3, -1).toString() == [1, 3, 4, 4, 5].toString(),
	[1, 2, 3, 4, 5].copyWithin(-4, -3).toString()     == [1, 3, 4, 5, 5].toString(),

].every(function (testResult) {
	return testResult;
}));

}
