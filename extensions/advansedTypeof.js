/* js-core advansed typeof extension, version 1.0.0
   More information: http://www.js-core.ru/
*/
(function(toString) {
	core.forEach('Object,Array,String,Function'.split(','), function(obj) {
		core['is' + obj] = function(arg) {
			return toString.call(arg) == '[object ' + obj + ']';
		};
	});
	core.typeOf = function(arg) {
		var str;
		return arg === null ? 'null' : arg === undefined ? 'undefined' : arg === window ? 'window' : arg.nodeType ? 'node' : (str = arg.toString()) == 'NaN' ? 'NaN' : str == 'Infinity' ? 'infinity' : (arg = toString.call(arg)).substring(8, arg.length - 1).toLowerCase();
	};
})(Object.prototype.toString);