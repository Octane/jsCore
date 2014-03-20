/**
 * Обёртка узла
 * @constructor
 * @extends $Object
 */
$.Node = function () {

	function $Node(node) {
		this.src = node;
	}

	$($Node).extend($.Object);

	Object.assign($Node.prototype, {

		is: function (anything) {
			//todo другие типы arg
			if (typeof anything == "string") {
				return this.src.nodeValue == anything;
			}
			return $.Object.prototype.is.call(this, anything);
		},

		parent: function () {
		},

		ancestor: function () {
		},

		appendTo: function () {
		},

		prependTo: function () {
		},

		insAfter: function () {
		},

		insBefore: function () {
		},

		wrap: function () {
		},

		remove: function () {
		},

		clone: function () {
		},

		toList: function () {
		}

	});

	return $Node;

}();
