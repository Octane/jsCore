
"head" in document || Object.defineProperty(document, "head", {
	get: function () {
		return this.query("head");
	}
});
