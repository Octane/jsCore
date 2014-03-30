
//IE8 dataset polyfill fix
try {
	Object.defineProperty({}, "test", {});
}
catch (error) {
	StaticDOMStringMap = function () {
		return document.createElement("dataset");
	};
}
