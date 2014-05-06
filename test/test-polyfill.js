'use strict';

document.addEventListener('DOMContentLoaded', function () {

    window.setImmediate(function () {


        window.requestAnimationFrame(function (t) {

            document.addEventListener('mousemove', {
                coords: 'x: {X}, y: {Y}',
                node: document.body.
                            appendChild(document.createElement('pre')).
                                appendChild(document.createTextNode('')),
                handleEvent: function (event) {
                    this.node.nodeValue = this.coords.
                                                replace('{X}', event.pageX).
                                                replace('{Y}', event.pageY);
                }
            });

            var event = document.createEvent('MouseEvent');
            event.initMouseEvent('mousemove', true, true, window, 'test',
                                 t, t, t, t, false, false, false, false, 0, null);
            document.dispatchEvent(event);

        });

    });

    window.getComputedStyle(document.body);
    document.body.classList;
    document.body.dataset;
    Promise.resolve();
    new FormData;
    new WeakMap;
    new WeakSet;
    new Map;
    new Set;

});
