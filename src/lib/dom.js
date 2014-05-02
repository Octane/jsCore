'use strict';

lib.dom = Object.assign({

    ready: function () {
        if ('complete' == document.readyState) {
            return Promise.resolve();
        }
        return lib.event.when(document, 'DOMContentLoaded');
    }

}, new function () {

    var css = lib.css,
        promise = css.animation || css.transition ?
        function (element, method, classes) {
            var style = window.getComputedStyle(element),
                animations = css.getAnimationNames(style);
            if (changeClasses(element, method, classes)) {
                return lib.event.awaitTransAnimEnd(element, animations);
            }
            return Promise.resolve(element);
        } : function (element, method, classes) {
            changeClasses(element, method, classes);
            return Promise.resolve(element);
        };

    function changeClasses(element, method, classes) {
        var className = element.className,
            classList = element.classList;
        classes.forEach(function (className) {
            classList[method](className);
        });
        return className != element.className;
    }

    function apply(method, args) {
        return promise(args[0], method, Array.slice(args, 1));
    }

    return {

        addClass: function () {
            return apply('add', arguments);
        },

        removeClass: function () {
            return apply('remove', arguments);
        },

        toggleClass: function () {
            return apply('toggle', arguments);
        }

    };

});
