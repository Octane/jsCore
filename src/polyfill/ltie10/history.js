
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
