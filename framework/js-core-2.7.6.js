/* js-core JavaScript framework, version 2.7.6
   Copyright (c) 2009 Dmitry Korobkin
   Released under the MIT License.
   More information: http://www.js-core.ru/
*/
(function(win, doc, core, ie, undefined) {
core.forEach = function(obj, func, context) {
	var length = obj.length, i = -1;
	if(length !== undefined) {
		while(++i < length) if(func.call(context, obj[i], i, obj) === false) break;
	}
	else for(var key in obj) if(obj.hasOwnProperty(key)) if(func.call(context, key, obj[key], obj) === false) break;
	return obj;
};
core.extend = function(obj, hash) {
	this.forEach(hash, function(key, value) {
		obj[key] = value;
	});
	return obj;
};
core.extend(core, {
	ie: ie,
	cache: {},
	id: function(arg) {
		return typeof arg === 'string' ? this.cache[arg] || (this.cache[arg] = doc.getElementById(arg)) : arg;
	},
	tag: function(tag, node) {
		return (node || doc).getElementsByTagName(tag || '*');
	},
	create: function(arg) {
		return typeof arg === 'string' ? doc.createElement(arg) : arg;
	},
	insert: function(node, arg, before) {
		return node.insertBefore(this.create(arg), before);
	},
	bind: win.addEventListener ? function(node, type, listener) {
		node.addEventListener(type, listener, false);
	} : function(expr) {
		return function(node, type, listener) {
			node.attachEvent('on' + type, expr.test(listener) ? this.context(listener, node) : listener);
		};
	}(/^function\s*\(/),
	unbind: win.removeEventListener ? function(node, type, listener) {
		node.removeEventListener(type, listener, false);
	} : function(node, type, listener) {
		node.detachEvent('on' + type, listener);
	},
	toArray: function(arg) {
		if(typeof arg === 'string') {
			var i = -1, j = 0, array = arg.split(' '), length = array.length;
			arg = [];
			while(++i < length) if(array[i]) arg[j++] = array[i];
		}
		return arg;
	},
	ready: function() {
		var ready, list = [], i = -1;
		return function(func) {
			if(func) ready ? func() : list.push(func);
			else if(!ready) {
				ready = true;
				var length = list.length;
				while(++i < length) list[i]();
				list = null;
			}
		};
	}(),
	context: function(func, context) {
		return function _func(arg) {
			return func.call(context, arg);
		};
	},
	preventDefault: function _func(event) {
		new core.event(event).preventDefault();
	},
	parse: function(html) {
		var div = document.createElement('div');
		div.innerHTML = html;
		return new this(div.firstChild);
	},
	n: function(tag) {
		return new this(doc.createElement(tag));
	},
	tags: function(tags) {
		return new core(doc).child(tags, true);
	},
	find: function(attrs, tags) {
		return new core(doc).find(attrs, tags);
	},
	findAttr: function(attr, values, tags) {
		return new core(doc).findAttr(attr, values, tags);
	},
	findClass: function(classes, tags) {
		return new core(doc).findClass(classes, tags);
	},
	makeArray: ie ? function(list) {
		var i = -1, length = list.length, array = [];
		while(++i < length) array[i] = list[i];
		return array;
	} : function(list) {
		return Array.prototype.slice.call(list);
	},
	list: function(items, filter) {
		if(this.list) return new this.list(items, filter);
		if(filter === false) this.items = items || [];
		else {
			var i = -1, j = 0, k = 0, length = items.length;
			this.items = [];
			while(++i < length) if(items[i].nodeType == 1 && (filter ? filter.call(items[i], j++) : true)) this.items[k++] = items[i];
		}
	},
	timer: function(time, func, context) {
		if(this.timer) return new this.timer(time, func, context);
		core.extend(this, {time: time, func: func, context: context, enabled: false});
	},
	event: function(event) {
		event = event || win.event;
		if(this.event) return new this.event(event);
		this.object = event;
	},
	trim: function(str) {
		return this.trim.both(str);
	}
});
core.prototype = {
	parent: function() {
		return new core(this.node.parentNode);
	},
	append: function(arg) {
		return new core(this.node.appendChild(core.create(arg)));
	},
	prepend: function(arg) {
		return new core(core.insert(this.node, arg, this.node.firstChild));
	},
	after: function(arg) {
		return new core(core.insert(this.node.parentNode, arg, this.node.nextSibling));
	},
	before: function(arg) {
		return new core(core.insert(this.node.parentNode, arg, this.node));
	},
	appendTo: function(arg) {
		(arg = new core(arg)).node.appendChild(this.node);
		return arg;
	},
	prependTo: function(arg) {
		core.insert((arg = new core(arg)).node, this.node, arg.node.firstChild);
		return arg;
	},
	insertAfter: function(arg) {
		var node = core.id(arg);
		return new core(core.insert(node.parentNode, this.node, node.nextSibling));
	},
	insertBefore: function(arg) {
		var node = core.id(arg);
		return new core(core.insert(node.parentNode, this.node, node));
	},
	clone: function(bool) {
		return new core(this.node.cloneNode(bool !== false));
	},
	replace: function(arg) {
		try {
			return this.before(core.create(arg));
		}
		catch(e) {}
		finally {
			this.remove();
		}
	},
	wrap: ie ? function(arg, side) {
		return new core(this.node.applyElement(core.create(arg), side));
	} : function(arg, side) {
		if(side === 'inside') {
			var nodes = doc.createDocumentFragment();
			core.forEach(core.makeArray(this.node.childNodes), function(node) {
				nodes.appendChild(node);
			});
			return new core(nodes).appendTo(this.append(arg).node);
		}
		else return this.appendTo(this.before(arg).node);
	},
	el: function(arg) {
		return arg ? this.replace(core.id(arg)) : this.node;
	},
	empty: function() {
		core.clear(this.node);
		while(this.node.firstChild) this.node.removeChild(this.node.firstChild);
		return this;
	},
	remove: function() {
		core.clear(this.node).parentNode.removeChild(this.node);
		return this;
	},
	html: function(str) {
		if(str !== undefined) {
			this.node.innerHTML = str;
			return this;
		}
		else return this.node.innerHTML;
	},
	text: function(str) {
		if(str !== undefined) {
			this.empty().node.appendChild(doc.createTextNode(str));
			return this;
		}
		else return this.node.innerText || this.node.textContent;
	},
	useDefault: function(prefix) {
		return function(type, def) {
			if(def) {
				this.node[prefix + type] = false;
				core.unbind(this.node, type, core.preventDefault);
			}
			else if(!this.node[prefix + type]) {
				this.node[prefix + type] = true;
				core.bind(this.node, type, core.preventDefault);
			}
			return this;
		};
	}('preventDefaultOn'),
	bind: function(type, listener, def) {
		core.bind(this.node, type, listener);
		return def !== undefined ? this.useDefault(type, def) : this;
	},
	unbind: function(type, listener, def) {
		core.unbind(this.node, type, listener);
		return def !== undefined ? this.useDefault(type, def) : this;
	},
	exist: function(exist, die) {
		if(exist && this.node) exist.call(this.node);
		else if(die && !this.node) die();
		return !!this.node;
	},
	hasClass: function(arg) {
		if(arg) {
			var className = ' ' + this.node.className + ' ', exist = true;
			core.forEach(core.toArray(arg), function(str) {
				if(className.indexOf(' ' + str + ' ') == -1) return exist = false;
			});
			return exist;
		}
		else return !!this.node.className;
	},
	addClass: function(classes) {
		var className = this.node.className, modified = false;
		if(className) {
			className = ' ' + className + ' ';
			core.forEach(core.toArray(classes), function(str) {
				if(className.indexOf(' ' + str + ' ') == - 1) {
					className += str + ' ';
					modified = true;
				}
			});
			if(modified) this.node.className = core.toArray(className).join(' ');
		}
		else this.node.className = classes;
		return this;
	},
	removeClass: function(classes) {
		if(classes) {
			var classes = ' ' + (classes.join ? classes.join(' ') : classes) + ' ', modified = false, i = 0, className = [];
			core.forEach(core.toArray(this.node.className), function(str) {
				if(classes.indexOf(' ' + str + ' ') == -1) className[i++] = str;
				else modified = true;
			});
			if(modified) this.node.className = className.join(' ');
		}
		else this.node.className = '';
		return this;
	},
	toggleClass: function(classes1, classes2) {
		var className = this.node.className;
		if(classes2) {
			if(className) {
				var i = 0;
				classes2 = core.toArray(classes2);
				className = ' ' + className + ' ';
				core.forEach(core.toArray(classes1), function(str) {
					className = className.replace(' ' + str + ' ', ' ' + classes2[i++] + ' ');
				});
				this.node.className = core.toArray(className).join(' ');
			}
		}
		else {
			if(className) {
				var fake = core.prototype.removeClass.call({node: {className: classes1}}, className).node.className;
				this.removeClass(classes1);
				if(fake) this.addClass(fake);
			}
			else this.addClass(classes1);
		}
		return this;
	},
	attr: function(arg, value) {
		if(value !== undefined) {
			var attr = arg;
			arg = {};
			arg[attr] = value;
		}
		else if(arg.join || arg.split) {
			var attributes = core.toArray(arg), length = attributes.length, i = -1, j = 0, result = [];
			while(++i < length) result[j++] = this.node[attributes[i]];
			return result.length == 1 ? result[0] : result;
		}
		core.extend(this.node, arg);
		return this;
	},
	removeAttr: function(attrs) {
		var i = (attrs = core.toArray(attrs)).length;
		while(i--) this.node[attrs[i]] = null;
		return this;
	},
	val: function(str) {
		return str !== undefined ? this.attr({value: str}): this.node.value;
	},
	is: function(arg, tag) {
		if(arg) {
			if(typeof arg == 'string') return this.node.tagName === arg.toUpperCase();
			var key = true;
			if(tag) arg.tagName = tag.toUpperCase();
			core.forEach(arg, function(attr, value) {
				if(this[attr] != value) return key = false;
			}, this.node);
			return key;
		}
		else return this.exist();
	},
	css: function(change, get) {
		return function(arg, value) {
			if(value !== undefined) {
				var property = arg;
				arg = {};
				arg[property] = value;
			}
			else if(arg.split || arg.join) {
				var properties = core.toArray(arg), length = properties.length, i = -1, j = 0, result = [];
				while(++i < length) result[j++] = get(this.node, properties[i]);
				return result.length == 1 ? result[0] : result;
			}
			change(this.node, arg);
			return this;
		};
	}(ie ? function() {
		return function(node, properties) {
			if(properties.opacity != undefined) {
				var alpha = node.filters['DXImageTransform.Microsoft.alpha'] || node.filters.alpha;
				alpha ? alpha.opacity = properties.opacity * 100 : node.style.filter += ' progid:DXImageTransform.Microsoft.Alpha(opacity=' + properties.opacity * 100 + ')';
				delete properties.opacity;
			}
			if(properties.cssFloat) {
				properties.styleFloat = properties.cssFloat;
				delete properties.cssFloat;
			}
			core.extend(node.style, properties);
		};
	}() : function(node, properties) {
		core.extend(node.style, properties);
	}, ie ? function(specify) {
		return function(node, property) {
			return specify[property] ? specify[property](node) : node.currentStyle[property];
		};
	}({cssFloat: function(node) {
		return node.currentStyle.styleFloat;
	}, backgroundPosition: function(node) {
		return node.currentStyle.backgroundPositionX + ' ' + node.currentStyle.backgroundPositionY;
	}, opacity: function(node) {
		if(node.filters.length) {
			var alpha = node.filters['DXImageTransform.Microsoft.alpha'] || node.filters.alpha;
			return alpha ? alpha.opacity / 100 : 1;
		}
		else return 1;
	}}) : function(node, property) {
		return doc.defaultView.getComputedStyle(node, null)[property];
	}),
	hide: function() {
		return this.css({display: 'none', visibility: 'hidden'});
	},
	show: function(type) {
		return this.css({display: type || 'block', visibility: 'visible'});
	},
	visible: function() {
		var props = this.css(['display', 'visibility']);
		return props[0] !== 'none' && props[1] !== 'hidden';
	},
	toggle: function(type) {
		return this.visible() ? this.hide() : this.show(type);
	},
	position: function() {
		var node = this.node, top = 0, left = 0;
		do {
			top += node.offsetTop;
			left += node.offsetLeft;
		}
		while(node = node.offsetParent);
		return {top: top, left: left};
	},
	enabled: function(bool) {
		return typeof bool === 'boolean' ? (bool ? this.removeAttr(['disabled']) : this.attr({disabled: 'disabled'})) : !this.attr(['disabled']);
	},
	id: function(str) {
		if(str !== undefined) {
			delete core.cache[this.node.id];
			this.node.id = str;
			return this;
		}
		else return this.node.id;
	},
	serialize: function() {
		return this.node.outerHTML || new XMLSerializer().serializeToString(this.node);
	},
	find: function(attrs, tags) {
		var i = -1, n = 0, list = this.child(tags, true).items, length = list.length, key, array = [];
		if(attrs.split || attrs.join) {
			var j, k = (attrs = core.toArray(attrs)).length;
			while(++i < length) {
				j = k;
				key = true;
				while(j--) if(!list[i][attrs[j]]) {
					key = false;
					break;
				}
				if(key) array[n++] = list[i];
			}
		}
		else while(++i < length) {
			key = true;
			core.forEach(attrs, function(attr, value) {
				if(list[i][attr] != value) return key = false;
			});
			if(key) array[n++] = list[i];
		}
		return new core.list(array, false);
	},
	findAttr: function(attr, values, tags) {
		var i = -1, j, n = 0, k = (values = core.toArray(values)).length, list = this.child(tags, true).items, length = list.length, key, value, array = [];
		while(++i < length) {
			j = k;
			key = false;
			value = ' ' + list[i][attr] + ' ';
			while(j--) if(value.indexOf(' ' + values[j] + ' ') != -1) {
				key = true;
				break;
			}
			if(key) array[n++] = list[i];
		}
		return new core.list(array, false);		
	},
	child: function(find) {
		return function(tags, depth) {
			var i = -1, list = [], filter = false;
			if(tags === true || (!tags && depth)) list = this.node.getElementsByTagName('*');
			else if(tags) {
				if(depth) list = (i = (tags = core.toArray(tags)).length) == 1 ? this.node.getElementsByTagName(tags[0]) : find(this.node, tags, i);
				else {
					var child = this.node.childNodes, length = child.length, j = 0;
					tags = ' ' + (tags.join ? tags.join(' ') : tags).toUpperCase() + ' ';
					while(++i < length) if(tags.indexOf(' ' + child[i].tagName + ' ') != -1) list[j++] = child[i];
				}
			}
			else {
				list = this.node.childNodes;
				filter = null;
			}
			return new core.list(list, filter);
		}
	}(doc.querySelectorAll ? function(node, tags) {
		return node.querySelectorAll(tags.join(','));
	} : function(node, tags, i) {
		var list = [];
		while(i--) list = list.concat(core.makeArray(node.getElementsByTagName(tags[i])));
		return list;
	}),
	findClass: doc.querySelectorAll ? function(classes, tags) {
		var selector = [];
		classes = core.toArray(classes);
		if(tags) {
			var i, length = classes.length, j, k = 0;
			i = (tags = core.toArray(tags)).length;
			while(i--) {
				j = length;
				while(j--) selector[k++] = tags[i] + '.' + classes[j];
			}
			selector = selector.join(',');
		}
		else selector = '.' + classes.join(',.');
		return new core.list(this.node.querySelectorAll(selector), false);
	} : function(classes, tags) {
		return this.findAttr('className', classes, tags);
	}
};
core.extend(core.prototype, function(traversal, sibling, child) {
	if(doc.createElement('div').childElementCount === 0) {
		traversal = {next: 'nextElementSibling', prev: 'previousElementSibling', first: 'firstElementChild', last: 'lastElementChild'};
		sibling = function(node, dir, tag) {
			if(tag) {
				tag = tag.toUpperCase();
				while(node = node[dir]) if(node.tagName === tag) break;
				return node;
			}
			else return node[dir];
		};
		child = function(node, dir, tag) {
			return node ? (tag && node.tagName !== tag.toUpperCase() ? sibling(node, traversal[dir], tag) : node) : null;
		};
		core.clear = function(node) {
			node.childElementCount > 0 ? this.cache = {} : delete this.cache[node.id];
			return node;
		};
	}
	else {
		traversal = {next: 'nextSibling', prev: 'previousSibling', first: 'firstChild', last: 'lastChild'};
		sibling = function(node, dir, tag) {
			if(tag) tag = tag.toUpperCase();
			while(node = node[dir]) if(node.nodeType == 1 && (tag ? node.tagName === tag : true)) break;
			return node;
		};
		child = function(node, dir, tag) {
			return node && node.nodeType != 1 || (tag ? tag.toUpperCase() !== node.tagName : true) ? sibling(node, traversal[dir], tag) : node;
		};
		core.clear = function(node) {
			node.hasChildNodes() ? this.cache = {} : delete this.cache[node.id];
			return node;
		};
	}
	return {
		next: function(tag) {
			return new core(sibling(this.node, traversal.next, tag));
		},
		prev: function(tag) {
			return new core(sibling(this.node, traversal.prev, tag));
		},
		firstChild: function(tag) {
			return new core(child(this.node[traversal.first], 'next', tag));
		},
		lastChild: function(tag) {
			return new core(child(this.node[traversal.last], 'prev', tag));
		},
		nthChild: function(index, tags, depth) {
			return this.child(tags, depth).item(index);
		}
	};
}());
core.list.prototype = {
	item: function(i) {
		return new core(this.items[i]);
	},
	last: function() {
		return new core(this.items[this.items.length - 1] || false);
	},
	size: function() {
		return this.items.length;
	}
};
core.extend(core.list.prototype, function(slice) {
	function check(args) {
		var length = (args = slice.call(args, 1)).length < 2;
		return length ? {method: 'call', args: args[0]} : {method: 'apply', args: args};
	}
	core.forEach('resize,scroll,blur,focus,error,load,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,keydown,keypress,keyup,change,select,submit,reset'.split(','), function(listener) {
		return function(type) {
			core.prototype[type] = function(arg) {
				return arg ? this.bind(type, arg.call ? arg : listener(arg, arguments)) : this.node[type]();
			};
		};
	}(function(method, args) {
		return function() {
			var obj, exec = check(args);
			(obj = $(this))[method][exec.method](obj, exec.args);
		};
	}));
	return {
		filter: function(arg) {
			if(arg.call) return new core.list(this.items, arg);
			else {
				var obj = new core(this.items[0]), exec = check(arguments);
				return new core.list(this.items, exec.method === 'call' ? function() {
					obj.node = this;
					return obj[arg](exec.args);
				} : function() {
					obj.node = this;
					return core.prototype[arg].apply(obj, exec.args);
				});
			}
		},
		each: function(arg) {
			var i = this.items.length;
			if(arg.call) {
				while(i--) if(arg.call(this.items[i], i, this.items) === false) break;
			}
			else {
				var obj = new core(this.items[0]), exec = check(arguments);
				if(exec.method === 'call') while(i--) {
					obj.node = this.items[i];
					obj[arg](exec.args);
				}
				else while(i--) {
					obj.node = this.items[i];
					core.prototype[arg].apply(obj, exec.args);
				}
			}
			return this;
		}
	};
}(Array.prototype.slice));
core.timer.prototype = {
	start: function(timer) {
		if(!this.enabled) {
			(timer = this).enabled = true;
			(function() {
				timer.func.call(timer.context, timer);
				if(timer.enabled) win.setTimeout(arguments.callee, timer.time);
			})();
		}
		return this;
	},
	stop: function() {
		this.enabled = false;
		return this;
	},
	repeat: function(amount, callback, context, timer) {
		if(!this.enabled) {
			(timer = this).enabled = true;
			(function() {
				timer.func.call(timer.context, timer);
				if(timer.enabled && --amount) win.setTimeout(arguments.callee, timer.time);
				else {
					timer.enabled = false;
					if(callback) callback.call(context, timer);
				}
			})();
		}
		return this;
	}
};
core.event.prototype = {
	preventDefault: ie ? function() {
		this.object.returnValue = false;
		return this;
	} : function() {
		this.object.preventDefault();
		return this;
	},
	stopPropagation: ie ? function() {
		this.object.cancelBubble = true;
		return this;
	} : function() {
		this.object.stopPropagation();
		return this;
	},
	stop: function() {
		return this.preventDefault().stopPropagation();
	},
	target: function(target) {
		return function() {
			return this.object[target];
		};
	}(ie ? 'srcElement' : 'target'),
	mouseButton: function(attr, middle) {
		return function() {
			return this.object[attr] < 2 ? 'left' : this.object[attr] == middle ? 'middle' : 'right';
		};
	}(ie ? 'button' : 'which', ie ? 4 : 2),
	mousePosition: ie ? function(doc, body) {
		return function() {
			return {x: this.object.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), y: this.object.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0)};
		};
	}(doc.documentElement, doc.body) : function() {
		return {x: this.object.pageX, y: this.object.pageY};
	},
	key: ie ? function() {
		return this.object.keyCode;
	} : function() {
		return this.object.keyCode || this.object.which;
	}
};
core.extend(core.trim, {
	left: function(str) {
		return str.replace(/^\s+/, '');
	},
	right: function(str) {
		return str.replace(/\s+$/, '');
	},
	spaces: function(str) {
		return str.replace(/\s{2,}/g, ' ');
	},
	both: function(str) {
		return this.right(this.left(str));
	},
	all: function(str) {
		return this.both(this.spaces(str));
	}
});
win.core = win.$ ? core : (win.$ = core);
(function(type, listener) {
	ie ? doc.write(unescape('%3CSCRIPT onreadystatechange="if(this.readyState==\'complete\') core.ready()" defer="defer" src="\/\/:"%3E%3C/SCRIPT%3E')) : doc.addEventListener(type, listener, false);
	if(/KHTML|WebKit/i.test(navigator.userAgent)) (function() {
		/loaded|complete/.test(doc.readyState) ? core.ready() : win.setTimeout(arguments.callee, 10);
	})();
	core.bind(win, 'load', listener);
})('DOMContentLoaded', function() {
	core.ready();
});
})(window, document, function(arg) {
	if(this.core) return new core(arg);
	this.node = core.id(arg);
} /*@cc_on , ScriptEngineMinorVersion() @*/);