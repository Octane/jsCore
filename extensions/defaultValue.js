/**
 * Set default value for input elements
 * js-core varsion: 2.7.6
 */
core.prototype.defaultValue = function(str) {
	if(!this.node.value) this.node.value = str;
	return this.focus(function() {
		if(this.value == str) this.value = '';
	}).blur(function() {
		if(!core.trim(this.value)) this.value = str;
	});
};