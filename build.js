var fs = require("fs"), strict = '"use strict";';

fs.writeFileSync("jscore.js", [
	"polyfill.js",
	"ie8_polyfill.js",
	"library.js",
	"is.js",
	"class.js",
	"array.js",
	"event.js",
	"html.js",
	"template.js",
	"i18n.js"
].reduce(function (result, fileName) {
	return result + fs.readFileSync("src/" + fileName, "utf8").replace(strict, "");
}, strict), "utf8");
