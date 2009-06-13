/* js-core JavaScript framework, version 2.8.1
   Copyright (c) 2009 Dmitry Korobkin
   Released under the MIT License.
   More information: http://www.js-core.ru/
*/
(function(win, doc, element, core, ie, undefined) {
core.forEach = function(obj, func, context) {
	var length = obj.length, i = -1;
	if(length !== undefined) {
		while(++i < length) if(func.call(context, obj[i], i, obj, length) === false) break;
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
		return typeof arg == 'string' ? this.cache[arg] || (this.cache[arg] = doc.getElementById(arg)) : arg;
	},
	create: function(arg) {
		return typeof arg == 'string' ? doc.createElement(arg) : arg;
	},
	insert: function(node, arg, before) {
		return node.insertBefore(this.create(arg), before);
	},
	bind: win.addEventListener ? function(node, type, listener) {
		node.addEventListener(type, listener, false);
	} : function(node, type, listener) {
		node.attachEvent('on' + type, listener);
	},
	unbind: win.removeEventListener ? function(node, type, listener) {
		node.removeEventListener(type, listener, false);
	} : function(node, type, listener) {
		node.detachEvent('on' + type, listener);
	},
	isEmpty: function(obj) {
		var empty = true;
		core.forEach(obj, function() {
			return empty = false;
		});
		return empty;
	},
	isNumber: function(arg) {
		return !isNaN(arg * 1);
	},
	handlers: {
		guid: 1,
		fid: 1,
		createListener: function(guid) {
			return function(event) {
				core.forEach(core.handlers[guid].events[(event || (event = win.event)).type], function(fid, func) {
					if(func.call(this, event) === false) core.preventDefault(event);
				}, core.handlers[guid].link);
			};
		}
	},
	attrs: {
		htmlFor: 'for',
		className: 'class'
	},
	toArray: function(arg) {
		if(typeof arg == 'string') {
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
	parse: function(html) {
		var div = doc.createElement('div');
		div.innerHTML = html;
		return new this(div.firstChild);
	},
	n: function(tag) {
		return new this(doc.createElement(tag));
	},
	tag: function(tags) {
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
	preventDefault: ie ? function(event) {
		event.returnValue = false;
	} : function(event) {
		event.preventDefault();
	},
	stopPropagation: ie ? function(event) {
		event.cancelBubble = true;
	} : function(event) {
		event.stopPropagation();
	},
	stop: function(event) {
		core.preventDefault(event);
		core.stopPropagation(event);
	},
	target: function(target) {
		return function(event) {
			return event[target];
		};
	}(ie ? 'srcElement' : 'target'),
	relatedTarget: ie ? function(event) {
		return event.fromElement === event.srcElement ? event.toElement : event.fromElement;
	} : function(event) {
		return event.relatedTarget;
	},
	mouseButton: function(property, middle) {
		return function(event) {
			return event[property] < 2 ? 1 : event[property] == middle ? 3 : 2;
		};
	}(ie ? 'button' : 'which', ie ? 4 : 2),
	trim: String.prototype.trim ? function(str) {
		return str.trim();
	} : function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	},
	trimLeft: String.prototype.trimLeft ? function(str) {
		return str.trimLeft();
	} : function(str) {
		return str.replace(/^\s+/, '');
	},
	trimRight: String.prototype.trimRight ? function(str) {
		return str.trimRight();
	} : function(str) {
		return str.replace(/\s+$/, '');
	},
	computedStyle: ie ? function(node) {
		return node.currentStyle;
	} : function(node) {
		return doc.defaultView.getComputedStyle(node, null);
	}
});
(function(calc) {
	if (ie) {
		core.pageX = function(event) {
			return event.clientX + calc('Left');
		};
		core.pageY = function(event) {
			return event.clientY + calc('Top');
		};
	}
	else {
		core.pageX = function(event) {
			return event.pageX;
		};
		core.pageY = function(event) {
			return event.pageY;
		};
	}
})(function (side) {
	return (element['scroll' + side] || 0) - (element['client' + side] || 0);
});
core.prototype = {
	parent: function(tag) {
		var node = this.node.parentNode;
		if(tag) {
			tag = tag.toUpperCase();
			do if(node.tagName == tag) break;
			while(node = node.parentNode);
		}
		return new core(node);
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
	clone: function(cloneChild, cloneHandlers) {
		cloneChild = cloneChild !== false;
		cloneHandlers = cloneHandlers !== false;
		var list = cloneChild ? this.child(true).add(this.node) : new core.list([this.node]), clone, guid, handler, data = {};
		list.each(function(index) {
			guid = this.guid;
			this.guid = null;
			if(guid && core.handlers[guid]) {
				core.forEach(core.handlers[guid].events, function(type) {
					core.unbind(this, type, core.handlers[guid].listener);
				}, this);
				data[guid] = index;
			}
		});
		clone = new core(this.node.cloneNode(cloneChild));
		list = cloneChild ? clone.child(true).add(clone.node) : new core.list([clone.node]);
		core.forEach(data, function(guid, index) {
			(handler = core.handlers[guid]).link.guid = guid;
			core.forEach(handler.events, function(type) {
				core.bind(this.link, type, this.listener);
			}, handler);
			if(cloneHandlers) list.get(index).copyHandlers(handler.link);
		});
		return clone;
	},
	replace: function(arg) {
		arg = this.before(arg);
		this.remove();
		return arg;
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
		this.child(true).each('remove', false);
		while(this.node.firstChild) this.node.removeChild(this.node.firstChild);
		return this;
	},
	remove: function(child) {
		if(child !== false) this.empty();
		core.clear(this.unbind().node).parentNode.removeChild(this.node);
		return this;
	},
	html: function(str) {
		if(str !== undefined) {
			this.empty().node.innerHTML = str;
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
	bind: function(type, func) {
		var guid = this.node.guid || (this.node.guid = core.handlers.guid++);
		if(!core.handlers[guid]) core.handlers[guid] = {
			link: this.node,
			listener: core.handlers.createListener(guid),
			events: {}
		};
		if(type && !core.handlers[guid].events[type]) {
			core.handlers[guid].events[type] = {};
			core.bind(this.node, type, core.handlers[guid].listener);
		}
		if(func) {
			if(!func.fid) func.fid = core.handlers.fid++;
			core.handlers[guid].events[type][func.fid] = func;
		}
		else return core.handlers[guid];
		return this;
	},
	unbind: function(type, listener) {
		var handler = core.handlers[this.node.guid], events;
		if(handler) {
			events = handler.events;
			if(listener) {
				if(events[type]) delete events[type][listener.fid];
				if(core.isEmpty(events[type])) return this.unbind(type);
			}
			else if(type) {
				delete events[type];
				core.unbind(this.node, type, handler.listener);
				if(core.isEmpty(handler.events)) delete core.handlers[this.node.guid];
			}
			else {
				core.forEach(events, function(type) {
					core.unbind(this, type, handler.listener);
				}, this.node);
				delete core.handlers[this.node.guid];
			}
		}
		return this;
	},
	copyHandlers: function(arg, type) {
		var handler = core.handlers[core.id(arg).guid], current, node;
		if(handler) {
			current = this.bind(type);
			node = this.node;
			if(type) core.extend(current.events[type], handler.events[type]);
			else core.forEach(handler.events, function(type, list) {
				if(!this.events[type]) {
					this.events[type] = list;
					core.bind(node, type, this.listener);
				}
				else core.extend(this.events[type], list);
			}, current);
		}
		return this;
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
		var value = 'value' in this.node;
		return str !== undefined ? (value ? this.attr({value: str}) : this.text(str)) : (value ? this.node.value : ((value = this.node.firstChild) ? value.nodeValue : ''));
	},
	is: function(arg, tag) {
		if(arg) {
			if(typeof arg == 'string') return this.node.tagName == arg.toUpperCase();
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
		this.node.style.display = 'none';
		return this;
	},
	show: function(type) {
		this.node.style.display = type || 'block';
		return this;
	},
	visible: function() {
		return this.node.offsetWidth > 0 || this.node.offsetHeight > 0;
	},
	toggle: function(type) {
		this.node.style.display = this.css(['display']) == 'none' ? type || 'block' : 'none';
		return this;
	},
	enabled: function(bool) {
		return typeof bool == 'boolean' ? (bool ? this.removeAttr(['disabled']) : this.attr({disabled: 'disabled'})) : !this.attr(['disabled']);
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
	position: element.getBoundingClientRect ? function() {
		var rect = this.node.getBoundingClientRect();
		return {top: Math.round(rect.top +  (win.pageYOffset || element.scrollTop) - (element.clientTop || 0)), left: Math.round(rect.left + (win.pageXOffset || element.scrollLeft) - (element.clientLeft || 0))};
	} : function() {
		var top = 0, left = 0, node = this.node;
		while(node) {
			top += parseInt(node.offsetTop) || 0;
			left += parseInt(node.offsetLeft) || 0;
			node = node.offsetParent        
		}
		return {top: top, left: left};
	},
	find: doc.querySelectorAll ? function(attrs, tags) {
		var selector = [], i, j = 0;
		if(attrs.split || attrs.join)  {
			i = (attrs = core.toArray(attrs)).length;
			while(i--) selector[j++] = core.attrs[attrs[i]] || attrs[i].toLowerCase();
		}
		else core.forEach(attrs, function(attr, value) {
			selector[j++] = (core.attrs[attr] || attr.toLowerCase()) + '="' + value + '"';
		});
		selector = '[' + selector.join('][') + ']';
		if(tags) {
			var complex = [];
			i = (tags = core.toArray(tags)).length;
			j = 0;
			while(i--) complex[j++] = tags[i] + selector;
			selector = complex.join(',');
		}
		return new core.list(this.node.querySelectorAll(selector), false);
	} : function(attrs, tags) {
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
	findAttr: doc.querySelectorAll ? function(attr, values, tags) {
		var selector = [], i = (values = core.toArray(values)).length, j = 0, k = (tags = tags ? core.toArray(tags) : ['']).length, n = i;
		attr = core.attrs[attr] || attr.toLowerCase();
		while(k--) {
			while(i--) selector[j++] = tags[k] + '[' + attr + '~="' + values[i] + '"]';
			i = n;
		}
		return new core.list(this.node.querySelectorAll(selector.join(',')), false);
	} : function(attr, values, tags) {
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
	child: function(find, children, filter) {
		if('children' in element) {
			children = 'children';
			filter = false;
		}
		else children = 'childNodes';
		return function(tags, depth) {
			if(tags || depth) {
				var i = -1, list = [];
				if(tags === true || (!tags && depth)) list = this.node.getElementsByTagName('*');
				else if(tags) {
					if(depth) list = (i = (tags = core.toArray(tags)).length) == 1 ? this.node.getElementsByTagName(tags[0]) : find(this.node, tags, i);
					else {
						var child = this.node[children], length = child.length, j = 0;
						tags = ' ' + (tags.join ? tags.join(' ') : tags).toUpperCase() + ' ';
						while(++i < length) if(tags.indexOf(' ' + child[i].tagName + ' ') != -1) list[j++] = child[i];
					}
				}
				return new core.list(list, false);
			}
			else return new core.list(this.node[children], filter);
		};
	}(doc.querySelectorAll ? function(node, tags) {
		return node.querySelectorAll(tags.join(','));
	} : function(node, tags, i) {
		var list = [];
		while(i--) list = list.concat(core.makeArray(node.getElementsByTagName(tags[i])));
		return list;
	}),
	children: function(tags) {
		return this.child(tags, true);
	},
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
	} : doc.getElementsByClassName ? function(classes, tags) {
		return !tags && (classes = core.toArray(classes)).length == 1 ? new core.list(this.node.getElementsByClassName(classes[0]), false) : this.findAttr('className', classes, tags);
	} : function(classes, tags) {
		return this.findAttr('className', classes, tags);
	}
};
core.extend(core.prototype, function(traversal, sibling, child) {
	if('childElementCount' in element) {
		traversal = {next: 'nextElementSibling', prev: 'previousElementSibling', first: 'firstElementChild', last: 'lastElementChild'};
		sibling = function(node, dir, tag) {
			if(tag) {
				tag = tag.toUpperCase();
				while(node = node[dir]) if(node.nodeName == tag) break;
				return node;
			}
			return node[dir];
		};
		child = function(node, dir, tag) {
			return node ? (tag && node.tagName != tag.toUpperCase() ? sibling(node, traversal[dir], tag) : node) : null;
		};
		core.clear = function(node) {
			node.childElementCount ? this.cache = {} : delete this.cache[node.id];
			return node;
		};
	}
	else {
		traversal = {next: 'nextSibling', prev: 'previousSibling', first: 'firstChild', last: 'lastChild'};
		sibling = function(node, dir, tag) {
			if(tag) tag = tag.toUpperCase();
			while(node = node[dir]) if(node.nodeType == 1 && (tag ? node.tagName == tag : true)) break;
			return node;
		};
		child = function(node, dir, tag) {
			return node ? (node.nodeType == 1 && (tag ? tag.toUpperCase() == node.tagName : true) ? node : sibling(node, traversal[dir], tag)) : null;
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
		first: function(tag) {
			return new core(child(this.node[traversal.first], 'next', tag));
		},
		last: function(tag) {
			return new core(child(this.node[traversal.last], 'prev', tag));
		},
		nth: function(index, tags) {
			return this.child(tags).get(index);
		}
	};
}());
core.list.prototype = {
	get: function(index) {
		return index === undefined ? this.items : new core(this.items[index]);
	},
	getLast: function() {
		return new core(this.items[this.items.length - 1]);
	},
	size: function() {
		return this.items.length;
	},
	add: function(args) {
		if(!this.items.join) this.items = core.makeArray(this.items);
		if(!args.join && args.length !== undefined) args = core.makeArray(args);
		this.items = this.items.concat(args);
		return this;
	}
};
core.extend(core.list.prototype, function(slice) {
	function check(args) {
		var length = (args = slice.call(args, 1)).length < 2;
		return length ? {method: 'call', args: args[0]} : {method: 'apply', args: args};
	}
	core.forEach('resize,scroll,blur,focus,error,abort,onload,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,keydown,keypress,keyup,change,select,submit,reset'.split(','), function(listener) {
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
				return new core.list(this.items, exec.method == 'call' ? function() {
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
				if(exec.method == 'call') while(i--) {
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
core.prototype.store = core.list.prototype.store = function() {
	return core.storage = this;
};
core.restore = core.prototype.restore = core.list.prototype.restore = function() {
	var storage = core.storage;
	delete core.storage;
	return storage;
};
core.timer.prototype = {
	start: function() {
		if(!this.enabled) {
			var timer = this;
			timer.enabled = true;
			(function() {
				timer.func.call(timer.context, timer);
				if(timer.enabled) setTimeout(arguments.callee, timer.time);
			})();
		}
		return this;
	},
	stop: function() {
		this.enabled = false;
		return this;
	},
	repeat: function(amount, callback, context) {
		if(!this.enabled) {
			var timer = this;
			timer.enabled = true;
			(function() {
				timer.func.call(timer.context, timer);
				if(timer.enabled && --amount) setTimeout(arguments.callee, timer.time);
				else {
					timer.enabled = false;
					if(callback) callback.call(context || timer.context, timer);
				}
			})();
		}
		return this;
	}
};
win.core = win.$ ? core : (win.$ = core);
(function(listener) {
	core.bind(win, 'load', listener);
	if(!ie) return doc.addEventListener('DOMContentLoaded', listener, false);
	try {
		element.doScroll('left');
	}
	catch(error) {
		doc.write(unescape('%3CSCRIPT onreadystatechange="if(this.readyState==\'complete\') core.ready()" defer="defer" src="\/\/:"%3E%3C/SCRIPT%3E'));
	}
})(function() {
	core.unbind(doc, 'DOMContentLoaded', arguments.callee);
	core.unbind(win, 'load', arguments.callee);
	core.ready();
});
core.bind(win, 'unload', function() {
	delete core.cache;
	delete core.storage;
	delete core.handlers.guid;
	delete core.handlers.fid;
	delete core.handlers.createListener;
	core.forEach(core.handlers, function(guid, handler) {
		core.forEach(handler.events, function(type) {
			core.unbind(handler.link, type, handler.listener);
		}, handler);
	});
	delete core.handlers;
	core.unbind(win, 'unload', arguments.callee);
});
})(window, document, document.documentElement || document.body, function(arg) {
	if(this.core) return new core(arg);
	this.node = core.id(arg);
} /*@cc_on , ScriptEngineMinorVersion() @*/);