"use strict";

lib.Template = new function () {

    function Template(template) {
        this.template = Array.join(template, "");
    }

    //example: new lib.Template("Hi, {NAME}").match({name: "John"}) → "Hi, John"
    Template.prototype.match = function (stringMap) {
        return Object.keys(stringMap).reduceRight(function (template, key) {
            return template.split("{" + key.toUpperCase() + "}").join(stringMap[key]);
        }, this.template);
    };

    return Template;

};
