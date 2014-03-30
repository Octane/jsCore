var fs = require("fs"), strict = '"use strict";';

try {

	fs.writeFileSync("jscore.js", [

		"header.js",

		"polyfill/ie8/node.js",
		"polyfill/ie8/htmlelement.js",
		"polyfill/ie8/object.js",
		"polyfill/ie8/array.js",
		"polyfill/ie8/function.js",
		"polyfill/ie8/string.js",
		"polyfill/ie8/date.js",

		"polyfill/object.js",
		"polyfill/array.js",
		"polyfill/string.js",
		"polyfill/number.js",
		"polyfill/generic.js",
		"polyfill/setimmediate.js",
		"polyfill/promise.js",
		"polyfill/requestanimationframe.js",
		"polyfill/htmlelement.js",

		"polyfill/ie8/fix/slice.js",
		"polyfill/ie8/fix/dataset.js",
		"polyfill/ie8/fix/children.js",
		"polyfill/ie8/setimmediate.js",
		"polyfill/ie8/event.js",
		"polyfill/ie8/getcomputedstyle.js",

		"lib/namespace.js",
		"lib/is.js",
		"lib/class.js",
		"lib/array.js",
		"lib/event.js",
		"lib/html.js",
		"lib/template.js",
		"lib/i18n.js",
		"lib/ajax.js"

	].reduce(function (result, fileName) {
		return result + fs.readFileSync("src/" + fileName, "utf8").replace(strict, "");
	}, strict), "utf8");

	console.log("done");

}
catch (reason) {

	console.log(reason);

}
