"use strict";

window.FormData || new function () {

	var charset = "0123456789abcdefghijklmnopqrstuvwxyz";

	function shuffle() {
		return 0.5 - Math.random();
	}

	function getRndKey() {
		//like IE11
		return charset.split("").sort(shuffle).slice(0, 14).join("");
	}

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
		this.boundary = "---------------------------" + getRndKey();
	}

	Object.assign(FormData.prototype, {

		append: function(key, value) {
			Array.push(this, [key, value]);
		},

		toString: function() {
			var boundary = this.boundary, body = '';
			Array.forEach(this, function (field) {
				body += "--" + boundary + "\r\n";
				body += 'Content-Disposition: form-data; name="'+ encodeURIComponent(field[0]) + '"\r\n\r\n';
				body += encodeURIComponent(field[1]) + "\r\n";
			});
			body += "--" + boundary + "--";
			return body;
		}

	});

	window.FormData = FormData;

};
