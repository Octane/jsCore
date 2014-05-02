'use strict';

lib.event = Object.assign({

    preventDefault: function (event) {
        event.preventDefault();
    },

    stopPropagation: function(event) {
        event.stopPropagation();
    }

}, new function () {

    function off(eventDetails) {
        eventDetails.eventTypes.forEach(function (eventType) {
            eventDetails.element.removeEventListener(
                eventType,
                eventDetails.callback
            );
        });
    }

    function on(element, selector, eventTypes, callback) {
        var listener;
        if (arguments.length == 3) {
            callback = eventTypes;
            eventTypes = selector;
            selector = undefined;
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
    }

    function one(element, selector, eventTypes, callback) {
        var details;
        function listener(event) {
            off(details);
            if (callback.handleEvent) {
                callback.handleEvent(event);
            } else {
                callback.call(element, event);
            }
        }
        if (arguments.length == 3) {
            callback = eventTypes;
            eventTypes = selector;
            selector = undefined;
        }
        details = on(element, selector, eventTypes, listener);
    }

    function when(element, selector, eventTypes) {
        if (arguments.length == 2) {
            eventTypes = selector;
            selector = undefined;
        }
        return new Promise(function (resolve) {
            one(element, selector, eventTypes, resolve);
        });
    }

    return {
        off: off,
        on: on,
        one: one,
        when: when
    };

}, new function () {

    var css = lib.css,
        animation = css.animation,
        transition = css.transition,
        animationEnd = {
            animation: 'animationend',
            MozAnimation: 'mozAnimationEnd',
            WebkitAnimation: 'webkitAnimationEnd'
        }[animation],
        fallback = Promise.resolve;

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
            animations = css.getAnimationNames(element);
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
        delay = css.getTransitionTime(style);
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
            animations = css.getAnimationNames(style);
        animations = getNewAnimationNames(prevAnimations, animations);
        return Promise.all([
            awaitAnimationEnd(element, animations),
            awaitTransitionEnd(element, style)
        ]).then(function () {
            return element;
        });
    }

    return {

        animationEnd: animationEnd,
        animationStart: {
            animation: 'animationstart',
            MozAnimation: 'mozAnimationStart',
            WebkitAnimation: 'webkitAnimationStart'
        }[animation],
        animationIteration: {
            animation: 'animationiteration',
            MozAnimation: 'mozAnimationIteration',
            WebkitAnimation: 'webkitAnimationIteration'
        }[animation],
        transitionEnd: {
            transition: 'transitionend',
            MozTransition: 'mozTransitionEnd',
            WebkitTransition: 'webkitTransitionEnd'
        }[transition],

        awaitAnimationEnd: animation ? awaitAnimationEnd : fallback,
        awaitTransitionEnd: transition ? awaitTransitionEnd : fallback,
        awaitTransAnimEnd: animation || transition ? awaitTransAnimEnd :
                                                     fallback

    };

});
