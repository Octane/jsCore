//todo textarea.setSelectionRange( selectionStart, selectionEnd);

//http://habrahabr.ru/blogs/javascript/55922/
$.selection = {

	standardsCompliant: typeof getSelection != "undefined",//todo перенести в $.features

	get: function () {
		return this.standardsCompliant ? getSelection() : document.selection;
	},

	getRange: function () {
		//todo убрать try-catch (добавлен из-за ошибки в старых версиях Firefox)
		try {
			return this.get()[this.standardsCompliant ? "getRangeAt" : "createRange"](0);
		} catch (error) {
			try {
				return document.createRange();
			} catch (error) {
			}
		}
	},

	selectRange: function (range) {
		if (this.standardsCompliant) {
			var sel = this.get();
			sel.removeAllRanges();
			sel.addRange(range);
		} else {
			range.select();
		}
	},

	clear: function () {
		this.get()[this.standardsCompliant ? "removeAllRanges"  : "empty"]();
	}
};

$.range = {

	standardsCompliant: $.selection.standardsCompliant,//todo перенести в $.features

	TEXT_NODE: 3,

	stringify: function (range) {
		if (this.standardsCompliant) {
			return range.toString();
		}
		return range.text;
	},

	getRootContainer: function (range) {
		if (this.standardsCompliant) {
			var root = range.commonAncestorContainer;
			return root.nodeType == this.TEXT_NODE ? root.parentNode : root;
		}
		return range.parentElement();
	},

	isCollapsed: function (range) {
		return this.standardsCompliant ? range.collapsed : !range.htmlText.length;
	},

	clone: function (range) {
		return range[this.standardsCompliant ? "cloneRange" : "duplicate"]();
	},
	
	create: function () {
		return (this.standardsCompliant ? document : document.selection).createRange();
	}
};
