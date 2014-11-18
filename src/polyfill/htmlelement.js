'use strict';

function StaticDOMStringMap() {}

'dataset' in document.documentElement ||
Object.defineProperty(HTMLElement.prototype, 'dataset', {

    //simple implementation: the new property will not create an attribute

    get: new function () {

        function toUpperCase(str) {
            return str.charAt(1).toUpperCase();
        }

        function attrToPropName(attrName) {
            return attrName.substr(5).replace(/-./g, toUpperCase);
        }

        function attrToPropDesc(attr) {
            return {
                get: function () {
                    return attr.value;
                },
                set: function (value) {
                    attr.value = String(value);
                }
            };
        }

        function fillDataset(dataset, attrs) {
            Array.forEach(attrs, function (attr) {
                var attrName = attr.name.toLowerCase();
                if (attrName.startsWith('data-')) {
                    Object.defineProperty(
                        dataset,
                        attrToPropName(attrName),
                        attrToPropDesc(attr)
                    );
                }
            });
            return dataset;
        }

        return function () {
            return fillDataset(new StaticDOMStringMap, this.attributes);
        };

    }

});

//Element traversal polyfill
'children' in document.createDocumentFragment() || new function () {

    var ELEMENT_NODE = 1,
        proto,
        api = {

            firstElementChild: function () {
                var node = this.firstChild;
                while (node && ELEMENT_NODE != node.nodeType) {
                    node = node.nextSibling;
                }
                return node;
            },

            lastElementChild: function () {
                var node = this.lastChild;
                while (node && ELEMENT_NODE != node.nodeType) {
                    node = node.previousSibling;
                }
                return node;
            },

            nextElementSibling: function () {
                var node = this;
                do {
                    node = node.nextSibling;
                } while (node && ELEMENT_NODE != node.nodeType);
                return node;
            },

            previousElementSibling: function () {
                var node = this;
                do {
                    node = node.previousSibling;
                } while (node && ELEMENT_NODE != node.nodeType);
                return node;
            },

            childElementCount: function () {
                return this.children.length;
            },

            children: new function () {

                function StaticHTMLCollection() {}

                StaticHTMLCollection.prototype.item = function (index) {
                    return this[index] || null;
                };

                return function () {
                    var elements = new StaticHTMLCollection,
                        node,
                        nodes = this.childNodes,
                        length = nodes.length,
                        i = 0,
                        j = 0;
                    while (i < length) {
                        node = nodes[i];
                        if (ELEMENT_NODE == node.nodeType) {
                            elements[j++] = node;
                        }
                        i++;
                    }
                    elements.length = j;
                    return elements;
                };

            }

        };

    function defineGetter(key) {
        if (!(key in proto)) {
            Object.defineProperty(proto, key, {
                get: api[key]
            });
        }
    }

    proto = HTMLElement.prototype;
    Object.keys(api).forEach(defineGetter);

    [
        document.constructor,
        document.createDocumentFragment().constructor
    ].forEach(function (Constructor) {
        proto = Constructor.prototype;
        [
            'firstElementChild', 'lastElementChild',
            'childElementCount', 'children'
        ].forEach(defineGetter);
    });

};

document.documentElement.matches || new function () {

    var proto = HTMLElement.prototype;

    proto.matches = [
        proto.matchesSelector,
        proto.oMatchesSelector,
        proto.msMatchesSelector,
        proto.mozMatchesSelector,
        proto.webkitMatchesSelector
    ].find(Boolean);

    if (!proto.matches) {
        proto.matches = new function () {
            var ELEMENT_NODE = 1;
            function isContains(root, element, selector) {
                return Array.contains(root.querySelectorAll(selector), element);
            }
            return function (selector) {
                var contains,
                    root = this.parentNode;
                if (root) {
                    if (ELEMENT_NODE == root.nodeType) {
                        root = root.ownerDocument;
                    }
                    return isContains(root, this, selector);
                }
                root = document.createDocumentFragment();
                root.appendChild(this);
                contains = isContains(root, this, selector);
                root.removeChild(this);
            };
        };
    }

};

new function () {

    var docFragment = document.createDocumentFragment(),
        target = docFragment.constructor.prototype,
        source = HTMLElement.prototype;
    if (!docFragment.querySelector) {
        target.querySelector = source.querySelector;
        target.querySelectorAll = source.querySelectorAll;
    }

};
