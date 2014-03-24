var fs = require("fs");

fs.writeFileSync("jscore.js", [
	"polyfill.js",
	"ie8_polyfill.js",
	"license.js",
	"core.js",
	"function.js",
	"object.js",
	"node.js",
	"element.js",
	"object_list.js",
	"node_list.js",
	"element_list.js",
	"eof.js"
].reduce(function (result, fileName) {
	return result + fs.readFileSync("src/" + fileName, "utf8");
}, ""), "utf8");
