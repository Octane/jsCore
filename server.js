"use strict";

//http://stackoverflow.com/a/13635318
var http = require("http"),
	url  = require("url"),
	path = require("path"),
	fs   = require("fs"),
	port = process.argv[2] || 8888;
http.createServer(function (request, response) {
	var uri = url.parse(request.url).pathname,
		filename = path.join(process.cwd(), uri),
		contentTypesByExtension = {
			".html": "text/html",
			".txt":  "text/plain",
			".css":  "text/css",
			".js":   "text/javascript",
			".ico":  "image/x-icon"
		};
		fs.exists(filename, function (exists) {
			var headers, contentType;
			if(!exists) {
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
				return;
			}
			if (fs.statSync(filename).isDirectory()) {
				filename += "/index.html";
			}
			fs.readFile(filename, "binary", function(err, file) {
			if (err) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}
			headers = {};
			contentType = contentTypesByExtension[path.extname(filename)];
			if (contentType) {
				headers["Content-Type"] = contentType;
			}
			response.writeHead(200, headers);
			response.write(file, "binary");
			response.end();
		});
	});
}).listen(parseInt(port));

console.log("Static file server running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown");
