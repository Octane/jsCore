"use strict";

lib.I18n = new function () {

    function use(locale) {
        this.messageBundle = this[locale];
    }

    function add(locale, messageBundle) {
        this.locale = locale;
        this[locale] = messageBundle;
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
        i18n.add = add;
        i18n.use = use;
        i18n.add(locale, messageBundle);
        i18n.use(locale);
        return i18n;
    }

    return I18n;

};
