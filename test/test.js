'use strict';

try {
    console.log;
}
catch (error) {
    window.console = {
        log: function () {
            var pre = document.createElement('pre');
            pre.append(Array.join(arguments, ', '));
            document.body.append(pre);
        }
    };
}

lib.dom.ready().then(function () {
    lib.event.on(document, 'mousemove', {
        coords: new lib.Template('x: {X}, y: {Y}'),
        node: document.body.
                    appendChild(document.createElement('pre')).
                        appendChild(document.createTextNode('')),
        handleEvent: function (event) {
            this.node.nodeValue = this.coords.match({
                x: event.pageX,
                y: event.pageY
            });
        }
    });
});
