/* js-core default value extension, version 1.0.0
   More information: http://www.js-core.ru/
*/
core.prototype.defaultValue = function(str) {
	if(!this.node.value) this.node.value = str;
	return this.focus(function() {
		if(this.value == str) this.value = '';
	}).blur(function() {
		if(!core.trim(this.value)) this.value = str;
	});
};