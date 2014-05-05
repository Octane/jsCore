'use strict';

/**
 * jsCore builder v1.0
 * github.com/Octane/jsCore
 *
 * Warning: run the script from the root project folder!
 * > node build/build.js
 *
 * @requires UglifyJS2
 * github.com/mishoo/UglifyJS2
 * > npm install uglify-js
 */
var fs = require('fs'),
    UglifyJS = require('uglify-js'),

    cache = {},

    SOURCE_PATH = 'src/',
    BUILD_PATH = 'build/',
    DEV_PATH = 'dev/',
    MIN_PATH = 'min/',

    files = {
        header: {
            dev: BUILD_PATH + 'header.js',
            min: BUILD_PATH + 'header-min.js'
        },
        wrapper: {
            dev: BUILD_PATH + 'wrapper.js',
            min: BUILD_PATH + 'wrapper-min.js'
        },
        sources: readJSON(BUILD_PATH + 'file-order.json')
    },

    versions = readJSON(BUILD_PATH + 'versions.json'),
    semVer = readJSON('bower.json').version;

/**
 * Reads the JSON file from the disk.
 * @param {string} fileName - The file name with the project relative path.
 * @returns {Object} The JavaScript object.
 */
function readJSON(fileName) {
    return JSON.parse(readFile(fileName));
}

/**
 * Reads the file from the disk.
 * @param {string} fileName - The file name with the project relative path.
 * @returns {string} The contents of the file.
 */
function readFile(fileName) {
    if (fileName in cache) {
        return cache[fileName];
    }
    return fs.readFileSync(fileName, {encoding: 'utf8'});
}

/**
 * Writes the file to the disk.
 * @param {string} fileName - The file name with the project relative path.
 * @param {string} code - JavaScript code.
 * @returns {number} The number of characters.
 */
function writeFile(fileName, code) {
    console.log(' > ' + fileName);
    fs.writeFileSync(fileName, code, {encoding: 'utf8'});
    return code.length;
}

/**
 * Returns a new string with some or all matches of a pattern replaced by a replacement.
 * @param {string} code - JavaScript code.
 * @param {(string|RegExp)} pattern - The replacement pattern.
 * @param {string} replacement - The replacement code.
 * @returns {string} The new string.
 */
function replace(code, pattern, replacement) {
    return code.split(pattern).join(replacement);
}

/**
 * The project header (preamble) constructor.
 * @param {string} file - The file name of the project header.
 * @constructor
 */
function Header(file) {
    this.code = readFile(file);
}

Object.defineProperties(Header.prototype, {

    /**
     * JavaScript code.
     * @type {string}
     * @private
     */
    code: {
        value: 'JavaScript code',
        writable: true
    },

    /**
     * Sets the version number and the type of the build.
     * @param {string} type - The type of the build (library or polyfill).
     * @param {string} buildVer - The version of the build (0.0.0 IE8+).
     * @returns {string} Processed JavaScript code.
     */
    compile: {
        value: function (type, buildVer) {
            var code = this.code;
            code = replace(code, '{TYPE}', type);
            code = replace(code, '{VERSION}', buildVer);
            return code;
        }
    }

});

/**
 * The project body constructor.
 * @param {string} file - The file name of the project body wrapper.
 * @constructor
 */
function Wrapper(file) {
    this.code = readFile(file);
}

Object.defineProperties(Wrapper.prototype, {

    /**
     * JavaScript code.
     * @type {string}
     * @private
     */
    code: {
        value: 'JavaScript code',
        writable: true
    },

    /**
     * Embed project code in a big function.
     * @param {string} code - JavaScript code of the project.
     * @returns {string} Wrapped JavaScript code.
     */
    wrap: {
        value: function (code) {
           return replace(this.code, '{/*CODE*/}', code);
        }
    },

    /**
     * Wraps project code in the big function and minifies.
     * @param {string} code - JavaScript code of the project.
     * @returns {string} Wrapped and minified JavaScript code.
     */
    minify: {
        value: function (code) {
            //todo source map
            return UglifyJS.minify(this.wrap(code), {
                fromString: true
            }).code;
        }
    }

});

/**
 * The file list constructor.
 * @param {Array} orderedList - The list of the project source files.
 * @constructor
 */
function FileList(orderedList) {
    this.files = orderedList;
}

Object.defineProperties(FileList.prototype, {

    /**
     * The list of the project source files.
     * @type {Array}
     * @private
     */
    files: {
        value: [],
        writable: true
    },

    /**
     * Removes "use strict" at the beginning of a file.
     * @param {string} code - JavaScript code of the file.
     * @returns {string} Cleaned JavaScript code.
     */
    clean: {
        value: function (code) {
            return code.replace(/^['"]use strict['"];\r?\n/, '');
        }
    },

    /**
     * Excludes from the source file list in the specified directories.
     * @param {(string|Array.<string>)} directories - The list of the excluded directories.
     * @returns {Array} The filtered list of the source files.
     */
    exclude: {
        value: function (directories) {
            var files = this.files;
            if (!directories) {
                directories = [];
            }
            if ('string' == typeof directories) {
                directories = [directories];
            }
            files = files.filter(function (filePath) {
                var include = directories.every(function (directory) {
                    return -1 == filePath.indexOf(directory);
                });
                console.log((include ? ' + ' : ' - ') + filePath);
                return include;
            });
            console.log('\n Selected ' + files.length + ' files of ' + this.files.length);
            return files;

        }
    },

    /**
     * Excludes from the source file list in the specified directories and merges the files.
     * @param {(string|Array.<string>)} directories - The list of the excluded directories.
     * @returns {string} Merged JavaScript code.
     */
    merge: {
        value: function (exclude) {
            var clean = this.clean;
            return this.exclude(exclude).reduce(function (code, filePath) {
                return code + clean(readFile(SOURCE_PATH + filePath));
            }, '');
        }
    }

});

/**
 * The build constructor.
 * @param {string} type - The type of the build (library or polyfill).
 * @param {string} support - The supported version of Internet Explorer (IE8+, IE9+ or IE10+).
 * @param {(string|Array.<string>)} exclude - The list of the excluded directories.
 * @constructor
 */
function Build(type, support, exclude) {
    this.type = type;
    this.version = semVer + ' ' + support;
    console.log('\n Build jsCore JavaScript ' + this.type + ' v' + this.version + '\n');
    this.code = new FileList(files.sources).merge(exclude);
    console.log('\n Output files:');
}

Object.defineProperties(Build.prototype, {

    /**
     * The type of the build (library or polyfill).
     * @type {string}
     * @private
     */
    type: {
        value: 'library',
        writable: true
    },

    /**
     * The version of the build.
     * @type {string}
     * @private
     */
    version: {
        value: '0.0.0 IE8+',
        writable: true
    },

    /**
     * Merged JavaScript code.
     * @type {string}
     * @private
     */
    code: {
        value: 'JavaScript code',
        writable: true
    },

    /**
     * Excludes from the source file list in the specified directories and merges the files.
     * @param {(string|Array.<string>)} directories - The list of the excluded directories.
     * @returns {string} Merged JavaScript code.
     */
    devBuild: {
        value: function () {
            var header = new Header(files.header.dev).compile(this.type, this.version),
                body = new Wrapper(files.wrapper.dev).wrap(this.code);
            return header + body;
        }
    },

    /**
     * Excludes from the source file list in the specified directories and merges the files.
     * @param {(string|Array.<string>)} directories - The list of the excluded directories.
     * @returns {string} Merged JavaScript code.
     */
    minBuild: {
        value: function () {
            var type = 'library' == this.type ? '' : ' ' + this.type,
                header = new Header(files.header.min).compile(type, this.version),
                body = new Wrapper(files.wrapper.min).minify(this.code);
            return header + body;
        }
    }

});

//Build the all versions.
console.log('\n Start building jsCore v' + semVer);
versions.forEach(function (params) {
    var build = new Build(params.type, params.support, params.exclude),
        dev = build.devBuild(),
        min = build.minBuild();

    writeFile(DEV_PATH + params.name + '.js', dev);
    writeFile(MIN_PATH + params.name + '.js', min);

    console.log(' Compression: ' + Math.round(100 - min.length * 100 / dev.length) + '%');
    console.log('\n Done');
});
console.log('\n All done\n');
