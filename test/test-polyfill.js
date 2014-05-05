'use strict';

document.addEventListener('DOMContentLoaded', function () {

    setImmediate(function () {


        requestAnimationFrame(function () {

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

        });

    });

    getComputedStyle(document.body);
    document.body.classList;
    document.body.dataset;
    Promise.resolve();
    new FormData;
    new WeakMap;
    new WeakSet;
    new Map;
    new Set;

});
