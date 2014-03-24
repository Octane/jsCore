var fs = require("fs");

fs.writeFileSync("jscore.js", [
	"polyfill.js",
	"ie8_polyfill.js",
	"library.js"
].reduce(function (result, fileName) {
	return result + fs.readFileSync("src/" + fileName, "utf8");
}, ""), "utf8");
