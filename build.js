var fs = require('fs'),
    strict = "'use strict';",
    noIE8 = -1 != process.argv.indexOf('--no_ie8');

try {

    fs.writeFileSync('jscore.js', [


        'header.js',


        'polyfill/ltie10/ie8/htmlelement.js',
        'polyfill/ltie10/ie8/text.js',
        'polyfill/ltie10/ie8/head.js',
        'polyfill/ltie10/ie8/object.js',
        'polyfill/ltie10/ie8/array.js',
        'polyfill/ltie10/ie8/function.js',
        'polyfill/ltie10/ie8/string.js',
        'polyfill/ltie10/ie8/date.js',


        'polyfill/object.js',
        'polyfill/array.js',
        'polyfill/string.js',
        'polyfill/number.js',
        'polyfill/math.js',
        'polyfill/generic.js',
        'polyfill/set.js',
        'polyfill/map.js',
        'polyfill/weakset.js',
        'polyfill/weakmap.js',


        'polyfill/ltie10/ie8/setimmediate.js',


        'polyfill/setimmediate.js',
        'polyfill/promise.js',
        'polyfill/requestanimationframe.js',
        'polyfill/htmlelement.js',


        'polyfill/ltie10/htmlelement.js',
        'polyfill/ltie10/formdata.js',


        'polyfill/ltie10/ie8/fix/slice.js',
        'polyfill/ltie10/ie8/fix/splice.js',
        'polyfill/ltie10/ie8/fix/dataset.js',
        'polyfill/ltie10/ie8/fix/children.js',
        'polyfill/ltie10/ie8/event.js',
        'polyfill/ltie10/ie8/cssstyledeclaration.js',
        'polyfill/ltie10/ie8/getcomputedstyle.js',


        'lib/namespace.js',
        'lib/is.js',
        'lib/class.js',
        'lib/array.js',
        'lib/date.js',
        'lib/html.js',
        'lib/template.js',
        'lib/i18n.js',
        'lib/css.js',
        'lib/event.js',
        'lib/dom.js',
        'lib/request.js'


    ].reduce(function (result, fileName) {
        if (noIE8 && -1 != fileName.indexOf('/ie8/')) {
            console.log('skip: ' + fileName);
            return result;
        }
        console.log('include: ' + fileName);
        return result + fs.readFileSync('src/' + fileName, 'utf8').replace(strict, '');
    }, strict), 'utf8');

    console.log('\ndone');

}
catch (reason) {

    console.log(reason);

}
