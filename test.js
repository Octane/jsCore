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
			return this.then(undefined, onRejected);
		},

		catch_: function (onRejected) {
			return this["catch"](onRejected);
		}

	});

	return Promise;

};

new Promise(function (resolve, reject) {

});


//setImmediate & requestAnimationFrame test
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
				setImmediate(function (l, t) {
					textNode.nodeValue = "left: " + l + ", top: " + t;
				}, x, y);
			});
		}, event.pageX, event.pageY);
	}, false);

	var fps = document.createTextNode(""), count = 0, time = Date.now(), fix = 0;
	document.body.appendChild(fps);
	function testFPS() {
		count++;
		var t = Date.now();
		if (t - time >= 1000) {
			fix = count;

			time = t;
			count = 0;
		}
		fps.nodeValue = ", fps = " + fix + ", frame = " + count;
		requestAnimationFrame(testFPS);
	}

}
