'use strict';

lib.event = {

    //example: element.addEventListener('click', lib.event.preventDefault)
    preventDefault: function (event) {
        event.preventDefault();
    },

    stopPropagation: function (event) {
        event.stopPropagation();
    },

    when: function (element, selector, eventTypes) {
        if (arguments.length == 2) {
            eventTypes = selector;
            selector = null;
        }
        return new Promise(function (resolve) {
            lib.event.one(element, selector, eventTypes, resolve);
        });
    },

    one: function (element, selector, eventTypes, callback) {
        var details;
        function listener(event) {
            lib.event.off(details);
            if (callback.handleEvent) {
                callback.handleEvent(event);
            } else {
                callback.call(element, event);
            }
        }
        if (arguments.length == 3) {
            callback = eventTypes;
            eventTypes = selector;
            selector = null;
        }
        details = lib.event.on(element, selector, eventTypes, listener);
    },

    on: function (element, selector, eventTypes, callback) {
        var listener;
        if (arguments.length == 3) {
            callback = eventTypes;
            eventTypes = selector;
            selector = null;
        }
        if (selector) {
            selector += ',' + selector + ' *';
            listener = function (event) {
                var target = event.target;
                if (target.matches && target.matches(selector)) {
                    if (callback.handleEvent) {
                        callback.handleEvent(event);
                    } else {
                        callback.call(element, event);
                    }
                }
            };
        } else {
            listener = callback;
        }
        if ('string' == typeof eventTypes) {
            eventTypes = eventTypes.split(/[\s,]+/);
        }
        eventTypes.forEach(function (eventType) {
            element.addEventListener(eventType, listener);
        });
        return {
            element: element,
            eventTypes: eventTypes,
            callback: listener
        };
    },

    off: function (eventDetails) {
        eventDetails.eventTypes.forEach(function (eventType) {
            eventDetails.element.removeEventListener(
                eventType,
                eventDetails.callback
            );
        });
    }

};

//CSS animation and transition event types
//example: element.addEventListener(lib.event.animationEnd, callback)
Object.assign(lib.event, new function () {

    var animation = lib.css.animation;

    return {

        animationEnd: {
            animation: 'animationend',
            OAnimation: 'oanimationend',
            msAnimation: 'MSAnimationEnd',
            MozAnimation: 'mozAnimationEnd',
            WebkitAnimation: 'webkitAnimationEnd'
        }[animation],

        animationStart: {
            animation: 'animationstart',
            OAnimation: 'oanimationstart',
            msAnimation: 'MSAnimationStart',
            MozAnimation: 'mozAnimationStart',
            WebkitAnimation: 'webkitAnimationStart'
        }[animation],

        animationIteration: {
            animation: 'animationiteration',
            OAnimation: 'oanimationiteration',
            msAnimation: 'MSAnimationIteration',
            MozAnimation: 'mozAnimationIteration',
            WebkitAnimation: 'webkitAnimationIteration'
        }[animation],

        transitionEnd: {
            transition: 'transitionend',
            OTransition: 'otransitionend',
            MozTransition: 'mozTransitionEnd',
            WebkitTransition: 'webkitTransitionEnd'
        }[lib.css.transition]

    };

});

//awaitAnimationEnd, awaitTransitionEnd and awaitTransAnimEnd
Object.assign(lib.event, new function () {

    var transition = lib.css.transition,
        animationName = lib.css.animationName,
        animationEnd = lib.event.animationEnd;

    function getNewAnimationNames(oldNames, newNames) {
        if (!oldNames) {
            return newNames;
        }
        return newNames.reduce(function (names, name) {
            if (-1 == oldNames.indexOf(name)) {
                names.push(name);
            }
            return names;
        }, []);
    }

    function dequeue(animations, name) {
        var index = animations.indexOf(name);
        if (-1 != index) {
            animations.splice(index, 1);
        }
        return animations.length;
    }

    function awaitAnimationEnd(element, animations) {
        if (!animations) {
            animations = lib.css.getAnimationNames(element);
        }
        if (animations.length) {
            return new Promise(function (resolve) {
                function onAnimationEnd(event) {
                    if (!dequeue(animations, event.animationName)) {
                        element.removeEventListener(
                            animationEnd,
                            onAnimationEnd
                        );
                        resolve(element);
                    }
                }
                element.addEventListener(animationEnd, onAnimationEnd);
            });
        }
        return Promise.resolve(element);
    }

    function awaitTransitionEnd(element, style) {
        var delay;
        if (!style) {
            style = window.getComputedStyle(element);
        }
        delay = lib.css.getTransitionTime(style);
        if (delay) {
            return new Promise(function (resolve) {
                window.setTimeout(function () {
                    resolve(element);
                }, delay);
            });
        }
        return Promise.resolve(element);
    }

    function awaitTransAnimEnd(element, prevAnimations) {
        var style = window.getComputedStyle(element),
            animations = lib.css.getAnimationNames(style);
        animations = getNewAnimationNames(prevAnimations, animations);
        return Promise.all([
            awaitAnimationEnd(element, animations),
            awaitTransitionEnd(element, style)
        ]).then(function () {
            return element;
        });
    }

    function fallback(element) {
        return Promise.resolve(element);
    }

    return {

        awaitAnimationEnd: animationName ? awaitAnimationEnd : fallback,

        awaitTransitionEnd: transition ? awaitTransitionEnd : fallback,

        awaitTransAnimEnd: animationName || transition ?
                           awaitTransAnimEnd : fallback

    };

});
