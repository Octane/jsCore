'use strict';

lib.dom.ready().then(function () {

    var windows = [],
        files = [
            'dev/jscore.js',
            'dev/jscore-ie9.js',
            'dev/jscore-ie10.js',
            'dev/jscore-polyfill.js',
            'dev/jscore-polyfill-ie9.js',
            'dev/jscore-polyfill-ie10.js',
            'min/jscore.js',
            'min/jscore-ie9.js',
            'min/jscore-ie10.js',
            'min/jscore-polyfill.js',
            'min/jscore-polyfill-ie9.js',
            'min/jscore-polyfill-ie10.js'
        ],
        width = Math.round(screen.availWidth / files.length),
        height = 200,
        top = screen.availHeight - height,
        options = new lib.Template([
            'width={WIDTH}',
            'height={HEIGHT}',
            'left={LEFT}',
            'top={TOP}',
            'scrollbars=no'
        ].join(',')),
        html = new lib.Template([
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>',

                '<meta charset="UTF-8">',
                '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
                '<title>{JSCORE}</title>',
                '<link rel="shortcut icon" href="favicon.ico">',
                '<link rel="stylesheet" href="test/test.css">',

            '</head>',
            '<body>',

                '<pre>{JSCORE}</pre>',

                '<script>',
                    'window.onerror = function (error) {',
                        'logError(error);',
                        'document.documentElement.style.backgroundColor = "#f50";',
                        'return false;',
                    '};',
                '</scr' + 'ipt>',
                '<script src="{JSCORE}"></scr' + 'ipt>',
                '<script src="{TEST}"></scr' + 'ipt>',

            '</body>',
            '</html>'
        ]);

    function closeAll() {
        windows.forEach(function (win) {
            win.close();
        });
    }

    function testAll() {
        closeAll();
        files.forEach(function (jsCore, index) {
            var win = window.open('', 'test' + index, options.match({
                    width: width,
                    height: height,
                    top: top,
                    left: index * width
                })),
                doc = win.document;
            doc.open();
            doc.write(html.match({
                jsCore: jsCore,
                test: 'test/test' + (jsCore.contains('polyfill') ?
                                    '-polyfill' : '') + '.js'
            }));
            doc.close();
            //avoid closure
            win.logError = new Function(
                'msg',
                'console.log("Error in ' + jsCore + ': ", msg)'
            );
            windows.push(win);
        });
    }

    if (-1 == window.name.indexOf('test')) {
        window.onunload = closeAll;
        document.querySelector('#test-open').onclick = testAll;
        document.querySelector('#test-close').onclick = closeAll;
    }

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

    window.requestAnimationFrame(function (t) {
        var event = document.createEvent('MouseEvent');
        /*todo fix github.com/cubiq/iscroll/issues/501
        event.initMouseEvent('mousemove', true, true, window, 'test',
                             t, t, t, t, false, false, false, false, 0, null);
        */
        event.initEvent('mousemove', true, true);
        document.dispatchEvent(event);
    });

});
