'use strict';

lib.cookie = new function () {

    //The regular expressions and comments from:
    //developer.mozilla.org/docs/Web/API/document.cookie

    var doc = document,
        decode = decodeURIComponent,
        encode = encodeURIComponent;

    /**
     * Read a cookie. If the cookie doesn't exist a null value will be returned.
     * @param {string} key - The name of the cookie to read.
     * @returns {(string|null)}
     */
    function get(key) {
        return decode(
            doc.cookie.replace(
                new RegExp(
                    '(?:(?:^|.*;)\\s*' +
                    encode(key).replace(/[\-\.\+\*]/g, '\\$&') +
                    '\\s*\\=\\s*([^;]*).*$)|^.*$'
                ),
                '$1'
            )
        ) || null;
    }

    /**
     * Create/overwrite a cookie.
     * @param {string} key - The name of the cookie to create/overwrite.
     * @param {string} value - The value of the cookie.
     * @param {Object} [params] - The set of optional parameters.
     * @param {(number|string|Date)} [params.end] - The max-age in seconds
     *     (e.g. 31536e3 for a year, Infinity for a never-expires cookie)
     *     or the expires date in GMTString format or as Date object;
     *     if not specified it will expire at the end of session.
     * @param {string} [params.path] - E.g., "/", "/mydir"; if not specified,
     *     defaults to the current path of the current document location.
     * @param {string} [params.domain] - E.g., "example.com", ".example.com"
     *     (includes all subdomains) or "subdomain.example.com";
     *     if not specified, defaults to the host portion
     *     of the current document location.
     * @param {boolean} [params.secure] - The cookie will be transmitted
     *     only over secure protocol as https.
     * @returns {boolean}
     */
    function set(key, value, params) {
        params = params || {};
        var expires = '',
            end = params.end,
            path = params.path,
            domain = params.domain,
            secure = params.secure;
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
            return false;
        }
        if (end) {
            switch (end.constructor) {
                case Number:
                    expires = end === Infinity ?
                              '; expires=Fri, 31 Dec 9999 23:59:59 GMT' :
                              '; max-age=' + end;
                    break;
                case String:
                    expires = '; expires=' + end;
                    break;
                case Date:
                    expires = '; expires=' + end.toUTCString();
                    break;
            }
        }
        doc.cookie = encode(key) + '=' + encode(value) +
                                         expires +
                                         (domain ? '; domain=' + domain : '') +
                                         (path   ? '; path='   + path   : '') +
                                         (secure ? '; secure'           : '');
        return true;
    }

    /**
     * Delete a cookie.
     * @param {string} key - The name of the cookie to remove.
     * @param {Object} [params] - The set of optional parameters.
     * @param {string} [params.path] - E.g., "/", "/mydir"; if not specified,
     *     defaults to the current path of the current document location.
     * @param {string} [params.domain] - E.g., "example.com", ".example.com"
     *     (includes all subdomains) or "subdomain.example.com";
     *     if not specified, defaults to the host portion
     *     of the current document location.
     * @returns {boolean}
     */
    function remove(key, params) {
        params = params || {};
        var path = params.path,
            domain = params.domain;
        if (!key || !has(key)) {
            return false;
        }
        doc.cookie = encode(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
                                   (domain ? '; domain=' + domain : '') +
                                   (path ? '; path=' + path : '');
        return true;
    }

    /**
     * Check if a cookie exists.
     * @param {string} key - The name of the cookie to test.
     * @returns {boolean}
     */
    function has(key) {
        return (
            new RegExp(
                '(?:^|;\\s*)' +
                encode(key).replace(/[\-\.\+\*]/g, '\\$&') +
                '\\s*\\='
            )
        ).test(doc.cookie);
    }

    /**
     * Returns an array of all readable cookies from this location.
     * @returns {Array}
     */
    function keys() {
        return doc.cookie.replace(
            /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,
            ''
        ).split(/\s*(?:\=[^;]*)?;\s*/).map(decode);
    }

    return {
        get: get,
        set: set,
        has: has,
        remove: remove,
        keys: keys
    };

};
