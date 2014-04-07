"use strict";

window.FormData || new function () {

	/* <input type="file"> не поддерживается,
	 * но если известно содержимое файла,
	 * его можно добавить с помощью append
	 *
	 * (new FormData).append(name, fileValue[, fileName])
	 *
	 *    fileValue = {
	 *        name: "readme.txt",
	 *        type: "text/plain",
	 *        content: "…"
	 *    }
	 */

	var getBoundary = new function () {
		//like IE11
		var charset = "0123456789abcdefghijklmnopqrstuvwxyz", uniqueKeys = {};
		function shuffle() {
			return 0.5 - Math.random();
		}
		function generateKey() {
			var key = charset.split("").sort(shuffle).slice(0, 14).join("");
			if (!uniqueKeys[key]) {
				uniqueKeys[key] = 1;
				return key;
			}
			return generateKey();
		}
		return function () {
			return "---------------------------" + generateKey();
		};
	};

	function serializeForm(form) {
		//todo
		return [];
	}

	function FormData(form) {
		if (form) {
			//todo
			throw new Error("FormData: serializing of form does not implemented yet");
			Array.prototype.push.apply(this, serializeForm(form));
		}
		this.fake = true;
		this.form = form;
		this.boundary = getBoundary();
	}

	Object.assign(FormData.prototype, {

		append: function(name, value, fileName) {
			Array.push(this, {
				name: name,
				value: value,
				fileName: fileName
			});
		},

		toString: function() {
			//source by François de Metz
			//https://github.com/francois2metz/html5-formdata
			var boundary = this.boundary, body = "";
			Array.forEach(this, function (field) {
				var name = field.name, value = field.value;
				if (Object(value) === value) {
					body += 'Content-Disposition: form-data; name="' + name + '"; filename="' + (field.fileName || value.name) + '"\r\n';
					body += 'Content-Type: ' + value.type + '\r\n\r\n';
					body += value.content + "\r\n";
				}
				else {
					body += "--" + boundary + "\r\n";
					body += 'Content-Disposition: form-data; name="'+ name + '"\r\n\r\n';
					body += value + "\r\n";
				}
			});
			body += "--" + boundary + "--";
			return body;
		}

	});

	window.FormData = FormData;

};
