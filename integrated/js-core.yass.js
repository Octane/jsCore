/*
 * Integration YASS + js-core
 *
 * Components:
 *
 * Х js-core JavaScript framework, version 2.8.1
 *   Copyright (c) 2009 Dmitry Korobkin
 *   Released under the MIT License.
 *   More information: http://www.js-core.ru/
 *
 * Х js-core AJAX module, version 0.2.7
 *
 * Х YASS 0.3.8 Ч the fastest CSS selectors JavaScript library
 *   Experimental branch of YASS Ч CSS3 selectors with cache only
 *   Copyright (c) 2008 Nikolay Matsievsky aka sunnybear (webo.in, webo.name)
 *   Dual licensed under the MIT and GPL licenses.
 *
 * For details, see: info.txt
 *
 * TODO: Add :contains() to yass selectors engine
 */
(function(win, doc, element, core, ie, undefined) {
core.forEach = function(obj, func, context) {
	var length = obj.length, i = -1;
	var j = 0;
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
	cache: new Object,
	id: function(arg) {
		return typeof arg == 'string' ? this.cache[arg] || (this.cache[arg] = doc.getElementById(arg)) : arg;
	},
	create: function(arg) {
		return typeof arg == 'string' ? doc.createElement(arg) : arg;
	},
	addScript: function(path) {
		var e = core.create('script');
		$(e).attr({'src' : path,'type':'text/javascript'});
		document.getElementsByTagName('head')[0].appendChild(e);
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
	toArray: function(arg) {
		if(typeof arg == 'string') {
			var i = -1, j = 0, array = arg.split(' '), length = array.length;
			arg = new Array;
			while(++i < length) if(array[i]) arg[j++] = array[i];
		}
		return arg;
	},
	ready: function() {
		var ready, list = new Array, i = -1;
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
	find: function(selector, root, noCache) {
		return new core.list(core.yass(selector, root, noCache), false);
	},
	makeArray: ie ? function(list) {
		var i = -1, length = list.length, array = new Array;
		while(++i < length) array[i] = list[i];
		return array;
	} : function(list) {
		return Array.prototype.slice.call(list);
	},
	list: function(items, filter) {
		if(this.list) return new this.list(items, filter);
		if(filter === false) this.items = items || new Array;
		else {
			var i = -1, j = 0, k = 0, length = items.length;
			this.items = new Array;
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
	},
	yass: function(selector, root, noCache) {
		if (core.yass.c[selector] && !noCache && !root) {
			return core.yass.c[selector]
		}
		noCache = noCache || !!root;
		root = root || doc;
		var sets = new Array;
		if (/^[\w[:#.][\w\]*^|=!]*$/.test(selector)) {
			var idx = 0;
			switch (selector.charAt(0)) {
			case '#':
				idx = selector.slice(1);
				sets = doc.getElementById(idx);
				if (ie && sets.id !== idx) {
					sets = doc.all[idx]
				}
				sets = sets ? [sets] : new Array;
				break;
			case '.':
				var klass = selector.slice(1);
				if (core.yass.k) {
					sets = (idx = (sets = root.getElementsByClassName(klass)).length) ? sets: new Array
				} else {
					klass = ' ' + klass + ' ';
					var nodes = root.getElementsByTagName('*'), i = 0, node;
					while (node = nodes[i++]) {
						if ((' ' + node.className + ' ').indexOf(klass) != -1) {
							sets[idx++] = node
						}
					}
					sets = idx ? sets: new Array
				}
				break;
			case ':':
				var node, nodes = root.getElementsByTagName('*'), i = 0, ind = selector.replace(/[^(]*\(([^)]*)\)/, "$1"), mod = selector.replace(/\(.*/, '');
				while (node = nodes[i++]) {
					if (core.yass.mods[mod] && !core.yass.mods[mod](node, ind)) {
						sets[idx++] = node
					}
				}
				sets = idx ? sets: new Array;
				break;
			case '[':
				var nodes = root.getElementsByTagName('*'), node, i = 0, attrs = /\[([^!~^*|$ [:=]+)([$^*|]?=)?([^ :\]]+)?\]/.exec(selector), attr = attrs[1], eql = attrs[2] || '', value = attrs[3];
				while (node = nodes[i++]) {
					if (core.yass.attr[eql] && (core.yass.attr[eql](node, attr, value) || (attr === 'class' && core.yass.attr[eql](node, 'className', value)))) {
						sets[idx++] = node
					}
				}
				sets = idx ? sets: new Array;
				break;
			default:
				sets = (idx = (sets = root.getElementsByTagName(selector)).length) ? sets: new Array;
				break
			}
		} else {
			if(core.yass.q && selector.indexOf("!=") == -1) {
				try {
					sets = root.querySelectorAll(selector);
					return noCache ? sets : core.yass.c[selector] = sets;
				}
				catch(error) {}
			}
			var groups = selector.split(/ *, */), gl = groups.length - 1, concat = !!gl, group, singles, singles_length, single, i, ancestor, nodes, tag, id, klass, attr, eql, mod, ind, newNodes, idx, J, child, last, childs, item, h;
			while (group = groups[gl--]) {
				if (! (nodes = core.yass.c[group]) || noCache) {
					singles_length = (singles = group.replace(/(\([^)]*)\+/, "$1%").replace(/(\[[^\]]+)~/, "$1&").replace(/(~|>|\+)/, " $1 ").split(/ +/)).length;
					i = 0;
					ancestor = ' ';
					nodes = [root];
					while (single = singles[i++]) {
						if (single !== ' ' && single !== '>' && single !== '~' && single !== '+' && nodes) {
							single = single.match(/([^[:.#]+)?(?:#([^[:.#]+))?(?:\.([^[:.]+))?(?:\[([^!&^*|$[:=]+)([!$^*|&]?=)?([^:\]]+)?\])?(?:\:([^(]+)(?:\(([^)]+)\))?)?/);
							tag = single[1] || '*';
							id = single[2];
							klass = single[3] ? ' ' + single[3] + ' ': '';
							attr = single[4];
							eql = single[5] || '';
							mod = single[7];
							ind = mod === 'nth-child' || mod === 'nth-last-child' ? /(?:(-?\d*)n)?(?:(%|-)(\d*))?/.exec(single[8] === 'even' && '2n' || single[8] === 'odd' && '2n%1' || !/\D/.test(single[8]) && '0n%' + single[8] || single[8]) : single[8];
							newNodes = new Array;
							idx = J = 0;
							last = i == singles_length;
							while (child = nodes[J++]) {
								switch (ancestor) {
								case ' ':
									childs = child.getElementsByTagName(tag);
									h = 0;
									while (item = childs[h++]) {
										if ((!id || item.id === id) && (!klass || (' ' + item.className + ' ').indexOf(klass) != -1) && (!attr || (core.yass.attr[eql] && (core.yass.attr[eql](item, attr, single[6]) || (attr === 'class' && core.yass.attr[eql](item, 'className', single[6]))))) && !item.yeasss && !(core.yass.mods[mod] ? core.yass.mods[mod](item, ind) : mod)) {
											if (last) {
												item.yeasss = 1
											}
											newNodes[idx++] = item
										}
									}
									break;
								case '~':
									tag = tag.toLowerCase();
									while ((child = child.nextSibling) && !child.yeasss) {
										if (child.nodeType == 1 && (tag === '*' || child.nodeName.toLowerCase() === tag) && (!id || child.id === id) && (!klass || (' ' + child.className + ' ').indexOf(klass) != -1) && (!attr || (core.yass.attr[eql] && (core.yass.attr[eql](item, attr, single[6]) || (attr === 'class' && core.yass.attr[eql](item, 'className', single[6]))))) && !child.yeasss && !(core.yass.mods[mod] ? core.yass.mods[mod](child, ind) : mod)) {
											if (last) {
												child.yeasss = 1
											}
											newNodes[idx++] = child
										}
									}
									break;
								case '+':
									while ((child = child.nextSibling) && child.nodeType != 1) {}
									if (child && (child.nodeName.toLowerCase() === tag.toLowerCase() || tag === '*') && (!id || child.id === id) && (!klass || (' ' + item.className + ' ').indexOf(klass) != -1) && (!attr || (core.yass.attr[eql] && (core.yass.attr[eql](item, attr, single[6]) || (attr === 'class' && core.yass.attr[eql](item, 'className', single[6]))))) && !child.yeasss && !(core.yass.mods[mod] ? core.yass.mods[mod](child, ind) : mod)) {
										if (last) {
											child.yeasss = 1
										}
										newNodes[idx++] = child
									}
									break;
								case '>':
									childs = child.getElementsByTagName(tag);
									i = 0;
									while (item = childs[i++]) {
										if (item.parentNode === child && (!id || item.id === id) && (!klass || (' ' + item.className + ' ').indexOf(klass) != -1) && (!attr || (core.yass.attr[eql] && (core.yass.attr[eql](item, attr, single[6]) || (attr === 'class' && core.yass.attr[eql](item, 'className', single[6]))))) && !item.yeasss && !(core.yass.mods[mod] ? core.yass.mods[mod](item, ind) : mod)) {
											if (last) {
												item.yeasss = 1
											}
											newNodes[idx++] = item
										}
									}
									break
								}
							}
							nodes = newNodes
						} else {
							ancestor = single
						}
					}
				}
				if (concat) {
					if (!nodes.concat) {
						newNodes = new Array;
						h = 0;
						while (item = nodes[h]) {
							newNodes[h++] = item
						}
						nodes = newNodes
					}
					sets = nodes.concat(sets.length == 1 ? sets[0] : sets)
				} else {
					sets = nodes
				}
			}
			idx = sets.length;
			while (idx--) {
				sets[idx].yeasss = sets[idx].nodeIndex = sets[idx].nodeIndexLast = null
			}
		}
		return noCache ? sets: core.yass.c[selector] = sets;
	},
	ajax: function() {
		if(this.ajax) return new this.ajax();
		this.xhr = win.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
	},
	get: function(params, success, error) {
		new core.ajax().open(core.extend(params, {success: success, error: error}));
		return this;
	},
	post: function(params, success, error) {
		new core.ajax().open(core.extend(params, {method: 'POST', success: success, error: error}));
		return this;
	},
	getJSON: function(params, callback, error) {
		new core.ajax().open(core.extend(params, {dataType: 'json', success: function(response) {
			try {
				callback(win.JSON && JSON.parse ? JSON.parse(response) : eval('(' + response + ')'));
			}
			catch(error) {
				if(this.error) this.error(error);
			}
		}, error: error}));
		return this;
	}
});
core.extend(core.yass, {
	c: new Array,
	q: !!doc.querySelectorAll,
	k: !!doc.getElementsByClassName,
	attr: {
		'': function(child, attr) {
			return !! child.getAttribute(attr)
		},
		'=': function(child, attr, value) {
			return (attr = child.getAttribute(attr)) && attr === value
		},
		'&=': function(child, attr, value) {
			return (attr = child.getAttribute(attr)) && (new RegExp('(^| +)' + value + '($| +)').test(attr))
		},
		'^=': function(child, attr, value) {
			return (attr = child.getAttribute(attr) + '') && !attr.indexOf(value)
		},
		'$=': function(child, attr, value) {
			return (attr = child.getAttribute(attr) + '') && attr.indexOf(value) == attr.length - value.length
		},
		'*=': function(child, attr, value) {
			return (attr = child.getAttribute(attr) + '') && attr.indexOf(value) != -1
		},
		'|=': function(child, attr, value) {
			return (attr = child.getAttribute(attr) + '') && (attr === value || !!attr.indexOf(value + '-'))
		},
		'!=': function(child, attr, value) {
			return ! (attr = child.getAttribute(attr)) || !(new RegExp('(^| +)' + value + '($| +)').test(attr))
		}
	},
	mods: {
		'first-child': function(child) {
			return child.parentNode.getElementsByTagName('*')[0] !== child
		},
		'last-child': function(child) {
			var brother = child;
			while ((brother = brother.nextSibling) && brother.nodeType != 1) {}
			return !! brother
		},
		root: function(child) {
			return child.nodeName.toLowerCase() !== 'html'
		},
		'nth-child': function(child, ind) {
			console.dir(ind);
			var i = child.nodeIndex || 0, a = ind[3] = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0, b = ind[1];
			if (i) {
				return ! ((i + a) % b)
			} else {
				var brother = child.parentNode.firstChild;
				i++;
				do {
					if (brother.nodeType == 1 && (brother.nodeIndex = ++i) && child === brother && ((i + a) % b))
						return 0
				} while (brother = brother.nextSibling);
				return 1
			}
		},
		'nth-last-child': function(child, ind) {
			var i = child.nodeIndexLast || 0, a = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0, b = ind[1];
			if (i) {
				return ! ((i + a) % b)
			} else {
				var brother = child.parentNode.lastChild;
				i++;
				do {
					if (brother.nodeType == 1 && (brother.nodeLastIndex = i++) && child === brother && ((i + a) % b)) {
						return 0
					}
				} while (brother = brother.previousSibling);
				return 1
			}
		},
		empty: function(child) {
			return !! child.firstChild
		},
		contains: function(child, text) {
			return ! ( (core(child).text() || '').indexOf(text) > -1 );
		},
		parent: function(child) {
			return ! child.firstChild
		},
		'only-child': function(child) {
			return child.parentNode.getElementsByTagName('*').length != 1
		},
		checked: function(child) {
			return ! child.checked
		},
		lang: function(child, ind) {
			return child.lang !== ind && doc.documentElement.lang !== ind
		},
		enabled: function(child) {
			return child.disabled || child.type === 'hidden'
		},
		disabled: function(child) {
			return ! child.disabled
		},
		selected: function(child) {
			child.parentNode.selectedIndex;
			return ! child.selected
		}
	}
});
core.ajax.type = {
	html: 'text/html',
	text: 'text/plain',
	xml: 'application/xml, text/xml',
	json: 'application/json, text/javascript',
	script: 'text/javascript, application/javascript',
	'default': 'application/x-www-form-urlencoded'
};
core.ajax.accept = '*\/*';
core.ajax.prototype.open = function(params) {
	core.extend(this, {
		method: params.method || 'GET',
		url: params.url || location.href,
		async: params.async !== false,
		user: params.user || null,
		password: params.password || null,
		params: params.params || null,
		processData: params.processData === true,
		timeout: params.timeout || 0,
		contentType: core.ajax.type[params.contentType] || core.ajax.type['default'],
		dataType: core.ajax.type[params.dataType] ? core.ajax.type[params.dataType] + ', *\/*' : core.ajax.accept,
		requestHeaders: params.requestHeaders || null,
		success: params.success,
		error: params.error
	});
	if(this.params) {
		var params = new Array, process = this.process;
		core.forEach(this.params, function(key, value) {
			params.push([key, '=', process ? encodeURIComponent(value) : value].join(''));
		});
		this.params = params.join('&');
	}
	try {
		this.xhr.open(this.method, this.method == 'GET' && this.params ? this.url + '?' + this.params : this.url, this.async, this.user, this.password);
		this.xhr.setRequestHeader('Accept', this.dataType);
		this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		this.xhr.setRequestHeader('Content-Type', this.contentType);
		var ajax = this;
		if(this.requestHeaders) core.forEach(this.requestHeaders, function(key, value) {
			ajax.xhr.setRequestHeader(key, value);
		});
		this.xhr.send(this.params);
		(function() {
			if(ajax.xhr.readyState == 4) {
				if(ajax.xhr.status == 200 || !ajax.xhr.status && ajax.success) ajax.success(ajax.xhr.responseText);
				else if(ajax.error && !ajax.aborted) ajax.error(ajax.xhr.statusText);
			}
			else if(!ajax.aborted) setTimeout(arguments.callee, 20);
		})();
		if(this.async && this.timeout) setTimeout(function() {
			if(ajax.xhr.readyState != 4) {
				ajax.xhr.abort();
				ajax.aborted = true;
				if(ajax.error) ajax.error('Time is out');
			}
		}, this.timeout);
	}
	catch(error) {
		if(this.error) this.error(error);
	}
};
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
		var list = cloneChild ? this.find('*').add(this.node) : new core.list([this.node]), clone, guid, handler, data = new Object;
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
		list = cloneChild ? clone.find('*').add(clone.node) : new core.list([clone.node]);
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
		this.find('*').each('remove', false);
		while(this.node.firstChild) this.node.removeChild(this.node.firstChild);
		return this;
	},
	remove: function(child) {
		if(child !== false) this.empty();
		core.clear(this.unbind().node).parentNode.removeChild(this.node);
		return this;
	},
	/*
		ѕо заверению создателей ф-ии replaceHTML, она намного быстрее innerHTML (кроме IE и некоторых версий оперы)
		—сылка: http://blog.stevenlevithan.com/archives/faster-than-innerhtml
	*/
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
			events: new Object
		};
		if(type && !core.handlers[guid].events[type]) {
			core.handlers[guid].events[type] = new Object;
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
			var classes = ' ' + (classes.join ? classes.join(' ') : classes) + ' ', modified = false, i = 0, className = new Array;
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
			arg = new Object;
			arg[attr] = value;
		}
		else if(arg.join || arg.split) {
			var attributes = core.toArray(arg), length = attributes.length, i = -1, j = 0, result = new Array;
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
				arg = new Object;
				arg[property] = value;
			}
			else if(arg.split || arg.join) {
				var properties = core.toArray(arg), length = properties.length, i = -1, j = 0, result = new Array;
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
			top += ~~(1 * node.offsetTop) || 0;
			left += ~~(1 * node.offsetLeft) || 0;
			node = node.offsetParent
		}
		return {top: top, left: left};
	},
	child: function(children, filter) {
		if(doc.createElement('div').children !== undefined) {
			children = 'children';
			filter = false;
		}
		else children = 'childNodes';
		return function(tags) {
			if(tags) {
				var i = -1, list = new Array, child = this.node[children], length = child.length, j = 0;
				tags = ' ' + (tags.join ? tags.join(' ') : tags.split(',').join(' ')).toUpperCase() + ' ';
				while(++i < length) if(tags.indexOf(' ' + child[i].tagName + ' ') != -1) list[j++] = child[i];
				return new core.list(list, false);
			}
			else return new core.list(this.node[children], filter);
		};
	}(),
	find: function(selector, noCache) {
		return new core.list(core.yass(selector, this.node, noCache), false);
	},
	load: function(params, success, error) {
		var _this = this;
		new core.ajax().open(core.extend(params, {success: function(response) {
			var control = /^INPUT|BUTTON|TEXTAREA$/;
			_this[control.test(_this.node.tagName) ? 'val' : 'html'](response);
			if(success) success.call(_this.node, response, this.xhr);
		}, error: function(response) {
			if(error) error.call(_this.node, response, this.xhr);
		}}));
		return this;
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
			node.childElementCount ? this.cache = new Object : delete this.cache[node.id];
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
			node.hasChildNodes() ? this.cache = new Object : delete this.cache[node.id];
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
	add: function(args, root, noCache) {
		if(!this.items.join) this.items = core.makeArray(this.items);
		if(typeof args === 'string') args = core.yass(args, root, noCache);
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
if(!win.$$) win.$$ = core.find;
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
	delete core.yass.c;
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
