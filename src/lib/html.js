'use strict';

lib.html = {

    parse: function (string) {
        var node = document.createElement('div'),
            frag = document.createDocumentFragment();
        node.innerHTML = string;
        while (node.hasChildNodes()) {
            frag.appendChild(node.firstChild);
        }
        return frag;
    },

    escape: function (string) {
        var node = document.createElement('div');
        node.appendChild(document.createTextNode(string));
        return node.innerHTML;
    },

    unescape: function (string) {
        var node = document.createElement('div');
        node.innerHTML = string;
        return node.textContent;
    }

};
