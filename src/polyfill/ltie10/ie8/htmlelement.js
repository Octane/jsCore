
var HTMLElement = HTMLElement || Element;

"textContent" in document.documentElement ||
Object.defineProperty(HTMLElement.prototype, "textContent", {
    get: function () {
        return this.innerText;
    },
    set: function (value) {
        this.innerText = value;
    }
});
