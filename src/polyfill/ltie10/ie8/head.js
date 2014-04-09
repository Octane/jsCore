
"head" in document || Object.defineProperty(document.constructor.prototype, "head", {
	get: function () {
		return this.query("head");
	}
});
