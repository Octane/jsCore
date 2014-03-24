console.clear();

/**
 * Promise polyfill
 */
window.Promise = window.Promise || new function () {

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

//requestAnimationFrame
new function () {

	var b = document.body, i = 10, t = 0, times = [];

	function test(time) {
		//times.push(Math.round(time - t));
		times.push(time);
		t = time;
		if (i--) {
			requestAnimationFrame(test, b);
		}
		else {
			console.log(times.join("\n"));
		}
	}

	requestAnimationFrame(test, b);

}

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
			requestAnimationFrame(function () {
				textNode.nodeValue = x + ", " + y;
			});
		}, event.pageX, event.pageY);
	}, false);

}
