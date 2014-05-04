var fs = require('fs'),
    UglifyJS = require('uglify-js'),
    src = 'src/',
    files,
    versions,
    buildVer = JSON.parse(read('bower.json')).version;

console.log('\n Start building jsCore v' + buildVer);

files = [

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

];

versions = [
    {
        support: 'IE8+',
        output: {
            normal: 'jscore.js',
            minified: 'jscore.min.js'
        }
    },
    {
        support: 'IE9+',
        exclude: '/ie8/',
        output: {
            normal: 'jscore.ie9.js',
            minified: 'jscore.ie9.min.js'
        }
    },
    {
        support: 'IE10+',
        exclude: '/ltie10/',
        output: {
            normal: 'jscore.ie10.js',
            minified: 'jscore.ie10.min.js'
        }
    }
];

function read(file) {
    return fs.readFileSync(file, {encoding: 'utf8'});
}

function write(file, code) {
    fs.writeFileSync(file, code, {encoding: 'utf8'});
}

function exclude(path) {
    return files.filter(function (file) {
        var include = -1 == file.indexOf(path);
        console.log((include ? ' + ' : ' - ') + file);
        return include;
    });
}

function merge(files) {
    return files.reduce(function (code, file) {
        //todo normalize empty lines
        return code + read(src + file).replace("'use strict';", '');
    }, '');
}

function wrap(wrapper, code) {
    return wrapper.split('//code').join(code);
}

function setVer(header, ver) {
    return header.split('{VERSION}').join(ver);
}

function minify(code) {
    //todo source map
    return UglifyJS.minify(code, {fromString: true, warnings: true}).code;
}

try {
    versions.forEach(function (version) {

        var output = version.output,
            fileList,
            fileName = output.normal,
            minFileName = output.minified,
            semVer = buildVer + ' ' + version.support,
            code,
            minCode,
            mergedCode,
            headerCode,
            minHeaderCode,
            wrappedCode,
            minWrappedCode;

        console.log('\n Build jsCore v' + semVer + '\n');

        fileList = exclude(version.exclude),
        mergedCode = merge(fileList);
        console.log('\n Merged ' + fileList.length + ' files of ' + files.length);

        //normal
        headerCode = setVer(read(src + 'header.js'), semVer);
        wrappedCode = wrap(read(src + 'wrapper.js'), mergedCode);
        code = headerCode + wrappedCode;
        write(fileName, code);
        console.log(' Output file: ' + fileName);

        //minified
        minHeaderCode = setVer(read(src + 'header.min.js'), semVer);
        minWrappedCode = minify(wrap(read(src + 'wrapper.min.js'), mergedCode));
        minCode = minHeaderCode + minWrappedCode;
        write(minFileName, minCode);
        console.log(' Minified file: ' + minFileName + ', compression ' + Math.round(100 - minCode.length * 100 / code.length) + '%');

        console.log('\n Done');
    });

    console.log('\n All done\n');
}
catch (error) {
    console.log(error);
}
