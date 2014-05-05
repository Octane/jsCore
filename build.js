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

function readJSON(fileName) {
    return JSON.parse(readFile(fileName));
}

function readFile(fileName) {
    if (fileName in cache) {
        return cache[fileName];
    }
    return fs.readFileSync(fileName, {encoding: 'utf8'});
}

function writeFile(fileName, code) {
    console.log(' > ' + fileName);
    fs.writeFileSync(fileName, code, {encoding: 'utf8'});
    return code.length;
}

function replace(code, pattern, replacement) {
    return code.split(pattern).join(replacement);
}

function Header(file) {
    this.code = readFile(file);
}

Object.defineProperties(Header.prototype, {
    code: {
        value: 'JavaScript code',
        writable: true
    },
    compile: {
        value: function (type, buildVer) {
            var code = this.code;
            code = replace(code, '{TYPE}', type);
            code = replace(code, '{VERSION}', buildVer);
            return code;
        }
    }
});

function Wrapper(file) {
    this.code = readFile(file);
}

Object.defineProperties(Wrapper.prototype, {
    code: {
        value: 'JavaScript code',
        writable: true
    },
    wrap: {
        value: function (code) {
           return replace(this.code, '{/*CODE*/}', code);
        }
    },
    minify: {
        value: function (code) {
            //todo source map
            return UglifyJS.minify(this.wrap(code), {
                fromString: true
            }).code;
        }
    }
});

function FileList(orderedList) {
    this.files = orderedList;
}

Object.defineProperties(FileList.prototype, {
    files: {
        value: [],
        writable: true
    },
    clean: {
        value: function (code) {
            //todo normalize empty lines
            return code.replace("'use strict';", '');
        }
    },
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
    merge: {
        value: function (exclude) {
            var clean = this.clean;
            return this.exclude(exclude).reduce(function (code, filePath) {
                return code + clean(readFile(SOURCE_PATH + filePath));
            }, '');
        }
    }
});

function Build(params) {
    this.type = params.type;
    this.version = semVer + ' ' + params.support;
    console.log('\n Build jsCore JavaScript ' + this.type + ' v' + this.version + '\n');
    this.code = new FileList(files.sources).merge(params.exclude);
    console.log('\n Output files:');
}

Object.defineProperties(Build.prototype, {
    type: {
        value: 'library',
        writable: true
    },
    version: {
        value: '0.0.0 IE8+',
        writable: true
    },
    code: {
        value: 'JavaScript code',
        writable: true
    },
    devOut: {
        value: 'dev/jscore.js',
        writable: true
    },
    minOut: {
        value: 'min/jscore.js',
        writable: true
    },
    devBuild: {
        value: function () {
            var header = new Header(files.header.dev).compile(this.type, this.version),
                body = new Wrapper(files.wrapper.dev).wrap(this.code);
            return header + body;
        }
    },
    minBuild: {
        value: function () {
            var type = 'library' == this.type ? '' : ' ' + this.type,
                header = new Header(files.header.min).compile(type, this.version),
                body = new Wrapper(files.wrapper.min).minify(this.code);
            return header + body;
        }
    }
});

console.log('\n Start building jsCore v' + semVer);
versions.forEach(function (params) {
    var build = new Build(params),
        dev = build.devBuild(),
        min = build.minBuild();

    writeFile(DEV_PATH + params.name + '.js', dev);
    writeFile(MIN_PATH + params.name + '.js', min);

    console.log(' Compression: ' + Math.round(100 - min.length * 100 / dev.length) + '%');
    console.log('\n Done');
});
console.log('\n All done\n');
