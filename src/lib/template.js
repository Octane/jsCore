'use strict';

//example: new lib.Template('Hi, {NAME}').match({name: 'John'}) → 'Hi, John'
lib.Template = new function () {

    function Template(template) {
        this.template = template;
    }

    Template.match = function (template, replacements) {
        if (Array.isArray(template)) {
            template = template.join('');
        }
        return Object.keys(replacements).reduceRight(function (template, key) {
            var value = replacements[key];
            return template.split('{' + key.toUpperCase() + '}').join(value);
        }, template);
    };

    Template.prototype.match = function (replacements) {
        return Template.match(this.template, replacements);
    };

    return Template;

};
