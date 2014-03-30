"use strict";

lib.I18n = new function () {

	//todo http://jaysoo.ca/2014/03/20/i18n-with-es6-template-strings/

	function I18n() {}

	I18n.prototype.use = function (params) {
		/*
			params = {
				locale: "ru-RU",
				defaultCurrency: 'RUR',
				messageBundle: {
					"english {0} template": "russian {0} template"
				}
			}
		*/
		return function () {};
	};

	return I18n;

};
