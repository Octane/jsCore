
"textContent" in document.createTextNode("test") ||
Object.defineProperty(Text.prototype, "textContent", {
    get: function () {
        return this.nodeValue;
    },
    set: function (value) {
        this.nodeValue = value;
    }
});
