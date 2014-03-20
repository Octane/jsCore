/**
 * …
 * @constructor
 * @extends …
 * @param {…} …
 */
$.EventTarget = function () {

	function $EventTarget(object) {
		this.src = object;
	}

	Object.assign($EventTarget.prototype, {

		on: function (eventType, listener) {
			$console.error("$EventTarget.prototype.on not implemented");
			return this;
		},

		fire: function (eventType, data) {
			$console.error("$EventTarget.prototype.fire not implemented");
			return this;
		}

	});

	return $EventTarget;

}();
