'use strict';

//example: var tmpl = new lib.Template('Hi, {NAME}');
//         tmpl({name: 'John'}) → 'Hi, John'
lib.Template = new function () {

    function match(template, replacements) {
        return Object.keys(replacements).reduceRight(function (template, key) {
            var value = replacements[key];
            return template.split('{' + key.toUpperCase() + '}').join(value);
        }, template);
    }

    function Template(template) {
        return function (replacements) {
            return match(template, replacements)
        };
    }

    Template.match = match;

    return Template;

};
