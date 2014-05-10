/* jsCore JavaScript polyfill v0.4.6-alpha IE9+
 * © 2014 Dmitry Korobkin
 * Released under the MIT license
 * github.com/Octane/jsCore
 */
new function () {'use strict';

//IE9-11 Object.create bug fix
//webreflection.blogspot.com/2014/04/all-ie-objects-are-broken.html
(function () {
    var object = Object.create({});
    object[0] = null;
    return object.hasOwnProperty(0); //→ false in IE9-11
}()) || new function () {
    var create = Object.create;
    Object.create = function (prototype, properties) {
        var object = create(prototype, properties);
        if (!Object.hasOwnProperty.call(object, 0)) {
            //a numeric key fixes the bug,
            //it can be removed after,
            //unlike the alphabetic key
            Object.defineProperty(object, 0, {
                configurable: true
            });
            delete object[0];
        }
        return object;
    };
};

//using Object.keys: goo.gl/0QNMDz
//several sources: twitter.com/rwaldron/status/454114058640183296
//people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
if (!Object.assign) {
    Object.assign = function (target) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
            Object.keys(source).forEach(function (key) {
                target[key] = source[key];
            });
        });
        return target;
    };
}

if (!Object.is) {
    Object.is = function (value1, value2) {
        if (0 === value1 && 0 === value2) {
            return 1 / value1 === 1 / value2;
        }
        if (value1 !== value1) {
            return value2 !== value2;
        }
        return value1 === value2;
    };
}

if (!Array.from) {
    Array.from = function (iterable, func, boundThis) {
        if (!Object(iterable).length) {
            //bugs.ecmascript.org/show_bug.cgi?id=2435
            return [];
        }
        if (func) {
            return Array.map(iterable, func, boundThis);
        }
        return Array.slice(iterable, 0);
    };
}

if (!Array.of) {
    Array.of = function () {
        return Array.from(arguments);
    };
}

if (!Array.prototype.find) {
    Array.prototype.find = function (func, boundThis) {
        var value,
            length = this.length,
            i = 0;
        while (i < length) {
            if (i in this) {
                value = this[i];
                if (func.call(boundThis, value, i, this)) {
                    return value;
                }
            }
            i++;
        }
        return undefined;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (func, boundThis) {
        var value,
            length = this.length,
            i = 0;
        while (i < length) {
            if (i in this) {
                value = this[i];
                if (func.call(boundThis, value, i, this)) {
                    return i;
                }
            }
            i++;
        }
        return -1;
    };
}

if (!Array.prototype.fill) {
    Array.prototype.fill = function (value, start, end) {
        var length = this.length,
            i;
        start = Number(start) || 0;
        if (2 in arguments) {
            end = Number(end) || 0;
        }
        else {
            end = length;
        }
        i = start < 0 ? Math.max(length + start, 0) : Math.min(start, length);
        end = end < 0 ? Math.max(length + end, 0) : Math.min(end, length);
        while (i < end) {
            this[i] = value;
            i++;
        }
        return this;
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (string, position) {
        if (!position) {
            position = 0;
        }
        return this.indexOf(string, position) == position;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (string, position) {
        var lastIndex;
        position = position || this.length;
        position = position - string.length;
        lastIndex = this.lastIndexOf(string);
        return -1 != lastIndex && lastIndex == position;
    };
}

if (!String.prototype.contains) {
    String.prototype.contains = function (string, position) {
        return -1 != this.indexOf(string, position || 0);
    };
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        return new Array(count + 1).join(this);
    };
}

if (!Number.isFinite) {
    Number.isFinite = function (value) {
        return 'number' == typeof value && isFinite(value);
    };
}

if (!Number.isInteger) {
    Number.isInteger = function (value) {
        return 'number' == typeof value && isFinite(value) &&
               value > -9007199254740992 && value < 9007199254740992 &&
               Math.floor(value) == value;
    };
}

if (!Number.isNaN) {
    Number.isNaN = function (value) {
        return 'number' == typeof value && isNaN(value);
    };
}

if (!Number.parseInt) {
    Number.parseInt = parseInt;
}

if (!Number.parseFloat) {
    Number.parseFloat = parseFloat;
}

if (!Math.trunc) {
    Math.trunc = function (value) {
        value = Number(value);
        if (isNaN(value) || 0 === value || !Number.isFinite(value)) {
            return value;
        }
        return Math.sign(value) * Math.floor(Math.abs(value));
    };
}

if (!Math.sign) {
    Math.sign = function (value) {
        if (0 === value || isNaN(value)) {
            return value;
        }
        return (value > 0) - (value < 0);
    };
}

//Array and String generic methods polyfill
new function () {

    function fastApply(method, args) {
        var target = args[0];
        switch (args.length) {
            case 1:
                return method.call(target);
            case 2:
                return method.call(target, args[1]);
            case 3:
                return method.call(target, args[1], args[2]);
        }
        return method.apply(target, Array.prototype.slice.call(args, 1));
    }

    function createGeneric(method) {
        return function () {
            return fastApply(method, arguments);
        };
    }

    function createGenerics(source, names) {
        return names.reduce(function (methods, name) {
            methods[name] = createGeneric(source[name]);
            return methods;
        }, {});
    }

    function implement(object, methods) {
        Object.keys(methods).forEach(function (name) {
            if (!(name in object)) {
                object[name] = methods[name];
            }
        });
    }

    implement(Array, createGenerics(Array.prototype, [
        'concat', 'every', 'fill', 'filter', 'find',
        'findIndex', 'forEach', 'indexOf', 'join',
        'lastIndexOf', 'map', 'pop', 'push', 'reduce',
        'reduceRight', 'reverse', 'shift', 'slice',
        'some', 'sort', 'splice', 'unshift'
    ]));

    implement(String, createGenerics(String.prototype, [
        'charAt', 'charCodeAt', 'concat', 'contains','endsWith',
        'indexOf', 'lastIndexOf', 'match', 'repeat', 'replace',
        'search', 'slice', 'split', 'startsWith', 'substr',
        'substring', 'toLowerCase', 'toUpperCase', 'trim'
    ]));

};

window.Set || (window.Set = new function () {

    function Set() {
        if (arguments.length) {
            //todo
            throw Error("Set implementation doesn't accept parameters");
        }
        this.length = 0;
    }

    Object.assign(Set.prototype, {

        size: 0,

        add: function (value) {
            if (!this.has(value)) {
                this.size = Array.push(this, value);
            }
        },

        has: function (value) {
            return -1 != Array.findIndex(this, function (val) {
                return Object.is(value, val);
            });
        },

        'delete': function (value) {
            var index = Array.findIndex(this, function (val) {
                return Object.is(value, val);
            });
            if (-1 == index) {
                return false;
            }
            Array.splice(this, index, 1);
            this.size--;
            return true;
        },

        clear: function () {
            Array.splice(this, 0, this.length);
            this.size = 0;
        }

        //todo forEach, entries, keys, values

    });

    return Set;

});

window.Map || (window.Map = new function () {

    var KEY = 0,
        VALUE = 1;

    function Map() {
        if (arguments.length) {
            //todo
            throw Error("Map implementation doesn't accept parameters");
        }
        this.length = 0;
    }

    Object.assign(Map.prototype, {

        size: 0,

        _getPair: function (key) {
            return Array.find(this, function (pair) {
                return Object.is(key, pair[KEY]);
            });
        },

        set: function (key, value) {
            var pair = this._getPair(key);
            if (pair) {
                pair[VALUE] = value;
            } else {
                this.size = Array.push(this, [key, value]);
            }
        },

        get: function (key) {
            return Object(this._getPair(key))[VALUE];
        },

        has: function (key) {
            return Boolean(this._getPair(key));
        },

        'delete': function (key) {
            var index = Array.findIndex(this, function (pair) {
                return Object.is(key, pair[KEY]);
            });
            if (-1 == index) {
                return false;
            }
            Array.splice(this, index, 1);
            this.size--;
            return true;
        },

        clear: function () {
            Array.splice(this, 0, this.length);
            this.size = 0;
        }

        //todo forEach, entries, keys, values

    });

    return Map;

});

window.WeakSet || (window.WeakSet = new function () {

    function WeakSet() {
        if (arguments.length) {
            //todo
            throw Error("WeakSet implementation doesn't accept parameters");
        }
        this.length = 0;
    }

    function equalValue(value) {
        //this → value
        return this === value;
    }

    function validValue(value) {
        if (Object(value) !== value) {
            throw TypeError('Invalid value used in weak set');
        }
        return value;
    }

    Object.assign(WeakSet.prototype, {

        add: function (value) {
            if (!this.has(validValue(value))) {
                Array.push(this, value);
            }
        },

        has: function (value) {
            return -1 != Array.findIndex(this, equalValue, validValue(value));
        },

        'delete': function (value) {
            var index = Array.findIndex(this, equalValue, validValue(value));
            if (-1 == index) {
                return false;
            }
            Array.splice(this, index, 1);
            return true;
        },

        clear: function () {
            Array.splice(this, 0, this.length);
        }

    });

    return WeakSet;

});

window.WeakMap || (window.WeakMap = new function () {

    //todo
    //In native WeakMaps, references to key objects are held "weakly",
    //which means that they do not prevent garbage collection in case
    //there would be no other reference to the object.

    var KEY = 0,
        VALUE = 1;

    function WeakMap() {
        if (arguments.length) {
            //todo
            throw Error("WeakMap implementation doesn't accept parameters");
        }
        this.length = 0;
    }

    function equalKey(pair) {
        //this → key
        return this === pair[KEY];
    }

    function validKey(key) {
        if (Object(key) !== key) {
            throw TypeError('Invalid value used as weak map key');
        }
        return key;
    }

    Object.assign(WeakMap.prototype, {

        _getPair: function (key) {
            return Array.find(this, equalKey, validKey(key));
        },

        set: function (key, value) {
            var pair = this._getPair(key);
            if (pair) {
                pair[VALUE] = value;
            } else {
                Array.push(this, [key, value]);
            }
        },

        get: function (key) {
            return Object(this._getPair(key))[VALUE];
        },

        has: function (key) {
            return Boolean(this._getPair(key));
        },

        'delete': function (key) {
            var index = Array.findIndex(this, equalKey, validKey(key));
            if (-1 == index) {
                return false;
            }
            Array.splice(this, index, 1);
            return true;
        },

        clear: function () {
            Array.splice(this, 0, this.length);
        }

    });

    return WeakMap;

});

window.setImmediate || Object.assign(window, new function () {

    var uid = 0,
        storage = {},
        firstCall = true,
        message = 'setImmediatePolyfillMessage';

    function fastApply(args) {
        var func = args[0];
        switch (args.length) {
            case 1:
                return func();
            case 2:
                return func(args[1]);
            case 3:
                return func(args[1], args[2]);
        }
        return func.apply(window, Array.prototype.slice.call(args, 1));
    }

    function callback(event) {
        var data,
            key = event.data;
        if ('string' == typeof key && key.startsWith(message)) {
            data = storage[key];
            if (data) {
                delete storage[key];
                fastApply(data);
            }
        }
    }

    return {

        setImmediate: function () {
            var id = uid++,
                key = message + id;
            storage[key] = arguments;
            if (firstCall) {
                firstCall = false;
                window.addEventListener('message', callback);
            }
            window.postMessage(key, '*');
            return id;
        },

        clearImmediate: function (id) {
            delete storage[message + id];
        }

    };

});

window.Promise || (window.Promise = new function () {

    //todo thenable value support

    function isPromise(anything) {
        return anything instanceof Promise;
    }

    function isSettled(promise) {
        return promise._fulfilled || promise._rejected;
    }

    function allSettled(promises) {
        return Array.every(promises, isSettled);
    }

    function defaultOnFulfilled(value) {
        return value;
    }

    function defaultOnRejected(reason) {
        throw reason;
    }

    function call(callback) {
        callback();
    }

    function Promise(resolver) {
        Object.assign(this, {
            _fulfilled: false,
            _rejected: false,
            _value: undefined,
            _reason: undefined,
            _onFulfilled: [],
            _onRejected: []
        });
        this._resolve(resolver);
    }

    Promise.resolve = function (value) {
        if (isPromise(value)) {
            return value.then(defaultOnFulfilled, defaultOnRejected);
        }
        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    Promise.reject = function (reason) {
        return new Promise(function (resolve, reject) {
            reject(reason);
        });
    };

    Promise.race = function (promises) {
        return new Promise(function (resolve, reject) {
            Array.forEach(promises, function (promise) {
                promise.then(resolve, reject);
            });
        });
    };

    Promise.all = function (promises) {
        return new Promise(function (resolve, reject) {
            var values = [];
            Array.forEach(promises, function (promise, index) {
                promise.then(
                    function (value) {
                        values[index] = value;
                        if (allSettled(promises)) {
                            resolve(values);
                        }
                    },
                    reject
                );
            });
        });
    };

    Object.assign(Promise.prototype, {

        _resolve: function (resolver) {

            var promise = this;

            function resolve(value) {
                promise._fulfill(value);
            }

            function reject(reason) {
                promise._reject(reason);
            }

            try {
                resolver(resolve, reject);
            } catch(error) {
                if (!isSettled(promise)) {
                    reject(error);
                }
            }

        },

        _fulfill: function (value) {
            if (!isSettled(this)) {
                this._fulfilled = true;
                this._value = value;
                this._onFulfilled.forEach(call);
                this._clearQueue();
            }
        },

        _reject: function (reason) {
            if (!isSettled(this)) {
                this._rejected = true;
                this._reason = reason;
                this._onRejected.forEach(call);
                this._clearQueue();
            }
        },

        _enqueue: function (onFulfilled, onRejected) {
            this._onFulfilled.push(onFulfilled);
            this._onRejected.push(onRejected);
        },

        _clearQueue: function () {
            this._onFulfilled = [];
            this._onRejected = [];
        },

        then: function (onFulfilled, onRejected) {

            var promise = this;

            return new Promise(function (resolve, reject) {

                onFulfilled = onFulfilled || defaultOnFulfilled;
                onRejected = onRejected || defaultOnRejected;

                function asyncOnFulfilled() {
                    window.setImmediate(function () {
                        var value;
                        try {
                            value = onFulfilled(promise._value);
                        } catch (error) {
                            window.setImmediate(reject, error);
                            return;
                        }
                        if (isPromise(value)) {
                            value.then(resolve, reject);
                        } else {
                            window.setImmediate(resolve, value);
                        }
                    });
                }

                function asyncOnRejected() {
                    window.setImmediate(function () {
                        var reason;
                        try {
                            reason = onRejected(promise._reason);
                        } catch (error) {
                            window.setImmediate(reject, error);
                            return;
                        }
                        if (isPromise(reason)) {
                            reason.then(resolve, reject);
                        } else {
                            window.setImmediate(resolve, reason);
                        }
                    });
                }

                if (promise._fulfilled) {
                    asyncOnFulfilled();
                } else if (promise._rejected) {
                    asyncOnRejected();
                } else {
                    promise._enqueue(asyncOnFulfilled, asyncOnRejected);
                }

            });

        },

        'catch': function (onRejected) {
            return this.then(undefined, onRejected);
        }

    });

    return Promise;

});

window.requestAnimationFrame || Object.assign(window, {

    requestAnimationFrame: [
        window.msRequestAnimationFrame,
        window.mozRequestAnimationFrame,
        window.webkitRequestAnimationFrame,
        new function () {
            var fps = 60,
                delay = 1000 / fps,
                navigationStart = Date.now(),
                prevCallTime = navigationStart;
            return function (callback) {
                var curCallTime = Date.now(),
                    timeout = Math.max(0, delay - (curCallTime - prevCallTime)),
                    timeToCall = curCallTime + timeout;
                prevCallTime = timeToCall;
                return window.setTimeout(function () {
                    callback(timeToCall - navigationStart);
                }, timeout);
            };
        }
    ].find(Boolean),

    cancelAnimationFrame: [
        window.mozCancelAnimationFrame,
        window.webkitCancelAnimationFrame,
        window.cancelRequestAnimationFrame,
        window.msCancelRequestAnimationFrame,
        window.mozCancelRequestAnimationFrame,
        window.webkitCancelRequestAnimationFrame,
        window.clearTimeout
    ].find(Boolean)

});

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

//DOM4 mutation methods
'append' in document.createDocumentFragment() || new function () {

    var ELEMENT_NODE = 1,
        proto = HTMLElement.prototype,
        api  = {

            before: function (/* ...nodes */) {
                //todo IE8 removedNode.parentNode ≠ null
                var parentNode = this.parentNode;
                if (parentNode) {
                    parentNode.insertBefore(mutationMacro(arguments), this);
                }
            },

            after: function (/* ...nodes */) {
                var parentNode = this.parentNode,
                    nextSibling,
                    nodes;
                if (parentNode) {
                    nodes = mutationMacro(arguments);
                    nextSibling = this.nextSibling;
                    if (nextSibling) {
                        parentNode.insertBefore(nodes, nextSibling);
                    } else {
                        parentNode.appendChild(nodes);
                    }
                }
            },

            replace: function (/* ...nodes */) {
                var parentNode = this.parentNode;
                if (parentNode) {
                    parentNode.replaceChild(mutationMacro(arguments), this);
                }
            },

            remove: function () {
                var parentNode = this.parentNode;
                if (parentNode) {
                    parentNode.removeChild(this);
                }
            },

            append: function (/* ...nodes */) {
                this.appendChild(mutationMacro(arguments));
            },

            prepend: function () {
                this.insertBefore(mutationMacro(arguments), this.firstChild);
            },

            query: function (selector) {
                return this.querySelector(selector);
            },

            queryAll: function (selector) {
                return this.querySelectorAll(selector);
            },

            matches: [
                proto.matchesSelector,
                proto.oMatchesSelector,
                proto.msMatchesSelector,
                proto.mozMatchesSelector,
                proto.webkitMatchesSelector,
                function (selector) {
                    var contains,
                        root;
                    if (this === document) {
                        //if docFragment.constructor ≡ document.constructor
                        return false;
                    }
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
                }
            ].find(Boolean)

        };

    function isContains(root, element, selector) {
        return -1 != Array.indexOf(root.querySelectorAll(selector), element);
    }

    function mutationMacro(nodes) {
        var node,
            fragment,
            length = nodes.length,
            i;
        if (1 == length) {
            node = nodes[0];
            if ('string' == typeof node) {
                return document.createTextNode(node);
            }
            return node;
        }
        fragment = document.createDocumentFragment();
        nodes = Array.from(nodes);
        i = 0;
        while (i < length) {
            node = nodes[i];
            if ('string' == typeof node) {
                node = document.createTextNode(node);
            }
            fragment.appendChild(node);
            i++;
        }
        return fragment;
    }

    function implement(key) {
        if (!(key in proto)) {
            proto[key] = api[key];
        }
    }

    Object.keys(api).forEach(implement);

    proto = document.constructor.prototype;
    ['query', 'queryAll'].forEach(implement);

    proto = document.createDocumentFragment().constructor.prototype;
    ['append', 'prepend', 'query', 'queryAll', 'matches'].forEach(implement);

};

'classList' in document.documentElement ||
Object.defineProperty(HTMLElement.prototype, 'classList', {

    get: new function () {

        //todo InvalidCharacterError

        function DOMTokenList(getTokens, onChange) {
            this._getTokens = getTokens;
            this._onChange = onChange;
        }

        Object.assign(DOMTokenList.prototype, {

            _clear: function () {
                Array.splice(this, 0, this.length);
            },

            _push: function (tokens) {
                Array.prototype.push.apply(this, tokens);
            },

            _update: function () {
                this._clear();
                this._push(this._getTokens());
            },

            item: function (index) {
                this._update();
                return this[index] || null;
            },

            add: function () {
                var length;
                this._update();
                length = this.length;
                Array.forEach(arguments, function (token) {
                    if (-1 == Array.indexOf(this, token)) {
                        Array.push(this, token);
                    }
                }, this);
                if (length != this.length) {
                    this._onChange();
                }
            },

            remove: function () {
                var length;
                this._update();
                length = this.length;
                Array.forEach(arguments, function (token) {
                    var index = Array.indexOf(this, token);
                    if (-1 != index) {
                        Array.splice(this, index, 1);
                    }
                }, this);
                if (length != this.length) {
                    this._onChange();
                }
            },

            toggle: function (token, force) {
                this._update();
                if (force === false || this.contains(token)) {
                    this.remove(token);
                    return false;
                }
                this.add(token);
                return true;
            },

            contains: function (token) {
                this._update();
                return -1 != Array.indexOf(this, token);
            },

            toString: function () {
                return Array.join(this, ' ');
            }

        });

        function getClasses(className) {
            className = className.trim();
            return className ? className.split(/\s\s*/) : [];
        }

        return function () {
            var element = this;
            if (!element._classList) {
                element._classList = new DOMTokenList(
                    function () {
                        return getClasses(element.className);
                    },
                    function () {
                        //no reflow if no changes
                        //this → element._classList
                        element.className = this.toString();
                    }
                );
            }
            /*live update DOMTokenList
            element.addEventListener('DOMAttrModified', function (event) {
                if ('class' == event.attrName.toLowerCase()) {
                    element._classList._update();
                }
            }, false);*/
            element._classList._update();
            return element._classList;
        };

    }

});

window.FormData || (window.FormData = new function () {

    /* <input type="file"> not supported,
     * but if you know file contents,
     * it can be added using append:
     *
     * (new FormData).append(name, fileValue[, fileName])
     *
     *    fileValue = {
     *        name: 'readme.txt',
     *        type: 'text/plain',
     *        content: '…'
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
                return '-------------------------' + generateKey();
            };
        },

        serializeForm = new function () {
            function isSelected(option) {
                return option.selected;
            }
            function assertField(field) {
                var tag = field.nodeName.toLowerCase(),
                    type = field.type;
                if (!field.name) {
                    return false;
                }
                if (field.disabled) {
                    return false;
                }
                if ('fieldset' == tag) {
                    return false;
                }
                if ('select' == tag && field.multiple) {
                    return Array.some(field.options, isSelected);
                }
                if ('submit' == type || 'reset' == type ||
                    'button' == type || 'file'  == type) {
                    return false;
                }
                if (('radio' == type || 'checkbox' == type) && field.checked) {
                    return false;
                }
                return true;
            }
            function getValues(field) {
                if ('select' == field.tagName.toLowerCase() && field.multiple) {
                    return Array.reduce(
                        field.options,
                        function (values, option) {
                            if (isSelected(option)) {
                                values.push(option.value);
                            }
                            return values;
                        },
                        []
                    );
                }
                //todo replace CRLF
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
        this.boundary = getBoundary();
        if (form) {
            Array.prototype.push.apply(this, serializeForm(form));
        }
    }

    Object.assign(FormData.prototype, {

        notNative: true,

        append: function (name, value, fileName) {
            Array.push(this, {
                name: name,
                value: value,
                fileName: fileName
            });
        },

        toString: function () {
            //source by François de Metz
            //github.com/francois2metz/html5-formdata
            var boundary = this.boundary,
                body = '';
            Array.forEach(this, function (field) {
                var name = field.name,
                    value = field.value,
                    filename;
                body += '--' + boundary + '\r\n';
                if (Object(value) === value) {
                    filename = field.fileName || value.name;
                    body += 'Content-Disposition: form-data; name="';
                    body += name + '"; filename="' + filename + '"\r\n';
                    body += 'Content-Type: ' + value.type + '\r\n\r\n';
                    body += value.content + '\r\n';
                } else {
                    body += 'Content-Disposition: form-data; name="';
                    body += name + '"\r\n\r\n';
                    body += value + '\r\n';
                }
            });
            body += '--' + boundary + '--';
            return body;
        }

    });

    XMLHttpRequest.prototype.send = new function () {
        var send = XMLHttpRequest.prototype.send;
        return function (data) {
            if (data instanceof FormData) {
                this.setRequestHeader(
                    'Content-Type',
                    'multipart/form-data; boundary=' + data.boundary
                );
                data = data.toString();
            }
            send.call(this, data);
        };
    };

    return FormData;

});

history.pushState || new function () {

    console.log('history polyfill');

    var proto = history.constructor.prototype,
        loc = window.location,
        states = {},
        state = null,
        skip = {};

    function onPopState() {
        var event = document.createEvent('CustomEvent');
        event.initEvent('popstate', false, false);
        event.state = state;
        window.dispatchEvent(event);
    }

    proto.pushState = function (state, title, hash) {
        if (!hash.startsWith('#')) {
            hash = '#' + hash;
        }
        states[hash] = state;
        skip[hash] = true;
        loc.hash = hash;
    };

    proto.replaceState = function (state, title, hash) {
        throw Error('history.replaceState not implemented');
    };

    Object.defineProperty(proto, 'state', {
        get: function () {
            return state;
        }
    });

    window.addEventListener('hashchange', function (event) {
        var hash = loc.hash;
        if (skip[hash]) {
            delete skip[hash];
        } else {
            state = states[hash] || null;
            onPopState();
        }
    });

};

};//the end of jsCore
