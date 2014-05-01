
if (!String.prototype.trim) {
    String.prototype.trim = new function () {
        //https://github.com/kriskowal/es5-shim/
         //http://perfectionkills.com/chr-deviations/
        //http://blog.stevenlevithan.com/archives/faster-trim-javascript/
        var whitespace, left, right;
        whitespace = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000';
        whitespace += '\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008';
        whitespace += '\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
        whitespace = '[' + whitespace + ']';
        left = new RegExp('^' + whitespace + whitespace + '*');
        right = new RegExp(whitespace + whitespace + '*$');
        return function () {
            return this.replace(left, '').replace(right, '');
        };
    };
}
