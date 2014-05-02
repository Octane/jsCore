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
