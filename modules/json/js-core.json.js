/* js-core Cookie module, version 0.1
 * Copyright (c) 2009 Vlad Zaritovsky
 * 
 * Based on jQuery JSON Plugin (c) Brantley Harris
 * version: 2.1 (2009-08-14)
 * 
 * 
 * Using: 
 			var thing = {plugin: 'js-core-json', version: 0.1};
			var encoded = $.json.toJSON(thing);
			var name = $.json.evalJSON(encoded).plugin;
			var version = $.json.evalJSON(encoded).version;
			alert('Encoded: '+encoded);
			alert('Name: '+name);
			alert('Version: '+version);
 */

core.json = function() {
	if(this.json) return new this.json();
}

var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
};

core.json.toJSON = function(o)
{
	if (typeof(JSON) == 'object' && JSON.stringify) return JSON.stringify(o);
	var type = typeof(o);
    if (o === null) return "null";
    if (type == "undefined") return undefined;
    if (type == "number" || type == "boolean") return o + "";
    if (type == "string") return core.json.quoteString(o);
    if (type == 'object')
        {
            if (typeof o.toJSON == "function") return core.json.toJSON(o.toJSON());
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;
                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;
                var year = o.getUTCFullYear();
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;
                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push( core.json.toJSON(o[i]) || "null" );
                return "[" + ret.join(",") + "]";
            }
        
            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;
                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = core.json.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                if (typeof o[k] == "function") 
                    continue;  //skip pairs where the value is a function.
                var val = core.json.toJSON(o[k]);
                pairs.push(name + ":" + val);
            }

            return "{" + pairs.join(", ") + "}";
        }
}

core.json.evalJSON = function(src) {
	if (typeof(JSON) == 'object' && JSON.parse) return JSON.parse(src);
    return eval("(" + src + ")");
}

core.json.secureEvalJSON = function(src) {
	if (typeof(JSON) == 'object' && JSON.parse) return JSON.parse(src);
    var filtered = src;
    filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
    filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    if (/^[\],:{}\s]*$/.test(filtered))
		return eval("(" + src + ")");
    else
    	throw new SyntaxError("Error parsing JSON, source is not valid.");
}

core.json.quoteString = function(string)
{
	if (string.match(_escapeable)) 
	{
		return '"' + string.replace(_escapeable, function (a) {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
}
    


