"use strict";

lib.I18n = new function () {

	function use(locale, messageBundle) {
		this.locale = locale;
		this.messageBundle = messageBundle;
	}

	function I18n(locale, messageBundle) {
		function i18n(message, replacements) {
			if (message in i18n.messageBundle) {
				message = i18n.messageBundle[message];
			}
			if (replacements) {
				return new lib.Template(message).match(replacements);
			}
			return message;
		}
		i18n.use = use;
		i18n.use(locale, messageBundle);
		return i18n;
	}

	return I18n;

};
