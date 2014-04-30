
"head" in document || Object.defineProperty(HTMLDocument.prototype, "head", {
	get: function () {
		return this.query("head");
	}
});
