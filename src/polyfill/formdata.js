"use strict";

window.FormData || new function () {

	/* <input type="file"> не поддерживается, но если известно
	 * содержимое файла, его можно добавить с помощью append:
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
			var uniqueKeys = {};
			function generateKey() {
				var key = Math.random().toString().slice(2);
				if (!uniqueKeys[key]) {
					uniqueKeys[key] = 1;
					return key;
				}
				return generateKey();
			}
			return function () {
				return "-------------------------" + generateKey();
			};
		},

		serializeForm = new function () {
			function isSelected(option) {
				return option.selected;
			}
			function assertField(field) {
				var type = field.type, tag = field.nodeName.toLowerCase();
				if (!field.name) {
					return false;
				}
				if (field.disabled) {
					return false;
				}
				if (tag == "fieldset") {
					return false;
				}
				if (tag == "select" && field.multiple) {
					return Array.some(field.options, isSelected);
				}
				if (type == "submit" || type == "reset" || type == "button" || type == "file") {
					return false;
				}
				if ((type == "radio" || type == "checkbox") && field.checked) {
					return false;
				}
				return true;
			}
			function getValues(field) {
				if (field.nodeName.toLowerCase() == "select" && field.multiple) {
					return Array.reduce(field.options, function (values, option) {
						if (isSelected(option)) {
							values.push(option.value);
						}
						return values;
					}, []);
				}
				//todo CRLF
				return [field.value];
			}
			return function (form) {
				return Array.reduce(form.elements, function (result, field) {
					if (assertField(field)) {
						getValues(field).forEach(function (value) {
							result.push({
								name: field.name,
								value: value
							});
						});
					}
					return result;
				}, []);
			};
		};

	function FormData(form) {
		this.fake = true;
		this.boundary = getBoundary();
		if (form) {
			this.form = form;
			Array.prototype.push.apply(this, serializeForm(form));
		}
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
				body += "--" + boundary + "\r\n";
				if (Object(value) === value) {
					body += 'Content-Disposition: form-data; name="' + name + '"; filename="' + (field.fileName || value.name) + '"\r\n';
					body += "Content-Type: " + value.type + "\r\n\r\n";
					body += value.content + "\r\n";
				}
				else {
					body += 'Content-Disposition: form-data; name="'+ name + '"\r\n\r\n';
					body += value + "\r\n";
				}
			});
			body += "--" + boundary + "--";
			return body;
		}

	});

	XMLHttpRequest.prototype.send = new function () {
		var send = XMLHttpRequest.prototype.send;
		return function (data) {
			if (data instanceof FormData) {
				this.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + data.boundary);
				data = data.toString();
			}
			send.call(this, data);
		};
	};

	window.FormData = FormData;

};
