/**
 * YASS 0.3.8 + js-core 2.7.6 (compact) with AJAX Module 0.2.5
 */

(function(){
/*
* YASS 0.3.8 - The fastest CSS selectors JavaScript library
* JSX 1.1 - Multi-events and components loading library
*
* Copyright (c) 2008-2009 Nikolay Matsievsky aka sunnybear (webo.in),
* 2007-2009 Andrew Sumin (jsx.ru)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* $Date: 2009-01-27 15:30:27 +3000 (Tue, 26 Jan 2009) $
* $Rev: 363 $
*/
/**
 * Returns number of nodes or an empty array
 * @param {String} CSS selector
 * @param {DOM node} root to look into
 * @param {Boolean} disable cache of not
 */
var _ = function (selector, root, noCache) {
/*
Subtree added, second argument, thx to tenshi.
Return cache if exists. Third argument.
Return not cached result if root specified, thx to Skiv
*/
	if (_.c[selector] && !noCache && !root) {
		return  _.c[selector];
	}
/* re-define noCache*/
	noCache = noCache || !!root;
/* clean root with document */
	root = root || _.doc;
/* sets of nodes, to handle comma-separated selectors */
	var sets = [];
/* quick return or generic call, missed ~ in attributes selector */
	if (/^[\w[:#.][\w\]*^|=!]*$/.test(selector)) {
/*
some simple cases - only ID or only CLASS for the very first occurence
- don't need additional checks. Switch works as a hash.
*/
		var idx = 0;
/* the only call -- no cache, thx to GreLI */
		switch (selector.charAt(0)) {
			case '#':
				idx = selector.slice(1);
				sets = _.doc.getElementById(idx);
/*
workaround with IE bug about returning element by name not by ID.
Solution completely changed, thx to deerua.
Get all matching elements with this id
*/
				if (_.browser.ie && sets.id !== idx) {
					sets = _.doc.all[idx];
				}
				sets = sets ? [sets] : [];
				break;
			case '.':
				var klass = selector.slice(1);
				if (_.doc.getElementsByClassName) {
					sets = (idx = (sets = root.getElementsByClassName(klass)).length) ? sets : [];
				} else {
					klass = new RegExp('(^| +)' + klass + '($| +)');
					var nodes = root.getElementsByTagName('*'),
						i = 0,
						node;
					while (node = nodes[i++]) {
						if (klass.test(node.className)) {
							sets[idx++] = node;
						}

					}
					sets = idx ? sets : [];
				}
				break;
			case ':':
				var node,
					nodes = root.getElementsByTagName('*'),
					i = 0,
					ind = selector.replace(/[^(]*\(([^)]*)\)/,"$1"),
					mod = selector.replace(/\(.*/,'');
				while (node = nodes[i++]) {
					if (_.mods[mod] && !_.mods[mod](node, ind)) {
						sets[idx++] = node;
					}
				}
				sets = idx ? sets : [];
				break;
			case '[':
				var nodes = root.getElementsByTagName('*'),
					node,
					i = 0,
					attrs = /\[([^!~^*|$ [:=]+)([$^*|]?=)?([^ :\]]+)?\]/.exec(selector),
					attr = attrs[1],
					eql = attrs[2] || '',
					value = attrs[3];
				while (node = nodes[i++]) {
/* check either attr is defined for given node or it's equal to given value */
					if (_.attr[eql] && (_.attr[eql](node, attr, value) || (attr === 'class' && _.attr[eql](node, 'className', value)))) {
						sets[idx++] = node;
					}
				}
				sets = idx ? sets : [];
				break;
			default:
				sets = (idx = (sets = root.getElementsByTagName(selector)).length) ? sets : [];
				break;
		}
	} else {
/*
all other cases. Apply querySelector if exists.
All methods are called via . not [] - thx to arty
*/
		if (_.browser.q && selector.indexOf('!=') == -1) {
			sets = root.querySelectorAll(selector);
/* generic function for complicated selectors */
		} else {
/* number of groups to merge or not result arrays */
/*
groups of selectors separated by commas.
Split by RegExp, thx to tenshi.
*/
			var groups = selector.split(/ *, */),
/* group counter */
				gl = groups.length - 1,
/* if we need to concat several groups */
				concat = !!gl,
				group,
				singles,
				singles_length,
/* to handle RegExp for single selector */
				single,
				i,
/* to remember ancestor call for next childs, default is " " */
				ancestor,
/* current set of nodes - to handle single selectors */
				nodes,
/* for inner looping */
				tag, id, klass, attr, eql, mod, ind, newNodes, idx, J, child, last, childs, item, h;
/* loop in groups, maybe the fastest way */
			while (group = groups[gl--]) {
/*
try to avoid work - check cache. Will glitch a few
on concatinating different results with one tag.
*/
				if (!(nodes = _.c[group]) || noCache) {
/*
Split selectors by space - to form single group tag-id-class,
or to get heredity operator. Replace + in child modificators
to % to avoid collisions. Additional replace is required for IE.
Replace ~ in attributes to & to avoid collisions.
*/	
					singles_length = (singles = group.replace(/(\([^)]*)\+/,"$1%").replace(/(\[[^\]]+)~/,"$1&").replace(/(~|>|\+)/," $1 ").split(/ +/)).length;
					i = 0;
					ancestor = ' ';
/* is cleanded up with DOM root */
					nodes = [root];
/*
John's Resig fast replace works a bit slower than
simple exec. Thx to GreLI for 'greed' RegExp
*/
					while (single = singles[i++]) {
/* simple comparison is faster than hash */
						if (single !== ' ' && single !== '>' && single !== '~' && single !== '+' && nodes) {
							single = single.match(/([^[:.#]+)?(?:#([^[:.#]+))?(?:\.([^[:.]+))?(?:\[([^!&^*|$[:=]+)([!$^*|&]?=)?([^:\]]+)?\])?(?:\:([^(]+)(?:\(([^)]+)\))?)?/);
/* 
Get all required matches from exec:
tag, id, class, attribute, value, modificator, index.
*/
							tag = single[1] || '*';
							id = single[2];
							klass = single[3] ? new RegExp('(^| +)' + single[3] + '($| +)') : '';
							attr = single[4];
							eql = single[5] || '';
							mod = single[7];
/*
for nth-childs modificator already transformed into array.
Example used from Sizzle, rev. 2008-12-05, line 362.
*/
							ind = mod === 'nth-child' || mod === 'nth-last-child' ? /(?:(-?\d*)n)?(?:(%|-)(\d*))?/.exec(single[8] === 'even' && '2n' || single[8] === 'odd' && '2n%1' || !/\D/.test(single[8]) && '0n%' + single[8] || single[8]) : single[8];
/* new nodes array */
							newNodes = [];
/* 
cached length of new nodes array
and length of root nodes
*/
							idx = J = 0;
/* if we need to mark node with expando yeasss */
							last = i == singles_length;
/* loop in all root nodes */
							while (child = nodes[J++]) {
/*
find all TAGs or just return all possible neibours.
Find correct 'children' for given node. They can be
direct childs, neighbours or something else.
*/
								switch (ancestor) {
									case ' ':
										childs = child.getElementsByTagName(tag);
										h = 0;
										while (item = childs[h++]) {
/*
check them for ID or Class. Also check for expando 'yeasss'
to filter non-selected elements. Typeof 'string' not added -
if we get element with name="id" it won't be equal to given ID string.
Also check for given attributes selector.
Modificator is either not set in the selector, or just has been nulled
by modificator functions hash.
*/
											if ((!id || item.id === id) && (!klass || klass.test(item.className)) && (!attr || (_.attr[eql] && (_.attr[eql](item, attr, single[6]) || (attr === 'class' && _.attr[eql](item, 'className', single[6]))))) && !item.yeasss && !(_.mods[mod] ? _.mods[mod](item, ind) : mod)) {
/* 
Need to define expando property to true for the last step.
Then mark selected element with expando
*/
												if (last) {
													item.yeasss = 1;
												}
												newNodes[idx++] = item;
											}
										}
										break;
/* W3C: "an F element preceded by an E element" */
									case '~':
										tag = tag.toLowerCase();
/* don't touch already selected elements */
										while ((child = child.nextSibling) && !child.yeasss) {
											if (child.nodeType == 1 && (tag === '*' || child.nodeName.toLowerCase() === tag) && (!id || child.id === id) && (!klass || klass.test(item.className)) && (!attr || (_.attr[eql] && (_.attr[eql](item, attr, single[6]) || (attr === 'class' && _.attr[eql](item, 'className', single[6]))))) && !child.yeasss && !(_.mods[mod] ? _.mods[mod](child, ind) : mod)) {
												if (last) {
													child.yeasss = 1;
												}
												newNodes[idx++] = child;
											}
										}
										break;
/* W3C: "an F element immediately preceded by an E element" */
									case '+':
										while ((child = child.nextSibling) && child.nodeType != 1) {}
										if (child && (child.nodeName.toLowerCase() === tag.toLowerCase() || tag === '*') && (!id || child.id === id) && (!klass || klass.test(item.className)) && (!attr || (_.attr[eql] && (_.attr[eql](item, attr, single[6]) || (attr === 'class' && _.attr[eql](item, 'className', single[6]))))) && !child.yeasss && !(_.mods[mod] ? _.mods[mod](child, ind) : mod)) {
											if (last) {
												child.yeasss = 1;
											}
											newNodes[idx++] = child;
										}
										break;
/* W3C: "an F element child of an E element" */
									case '>':
										childs = child.getElementsByTagName(tag);
										i = 0;
										while (item = childs[i++]) {
											if (item.parentNode === child && (!id || item.id === id) && (!klass || klass.test(item.className)) && (!attr || (_.attr[eql] && (_.attr[eql](item, attr, single[6]) || (attr === 'class' && _.attr[eql](item, 'className', single[6]))))) && !item.yeasss && !(_.mods[mod] ? _.mods[mod](item, ind) : mod)) {
												if (last) {
													item.yeasss = 1;
												}
												newNodes[idx++] = item;
											}
										}
										break;
								}
							}
/* put selected nodes in local nodes' set */
							nodes = newNodes;
						} else {
/* switch ancestor ( , > , ~ , +) */
							ancestor = single;
						}
					}
				}
				if (concat) {
/* if sets isn't an array - create new one */
					if (!nodes.concat) {
						newNodes = [];
						h = 0;
						while (item = nodes[h]) {
							newNodes[h++] = item;
						}
						nodes = newNodes;
/* concat is faster than simple looping */
					}
					sets = nodes.concat(sets.length == 1 ? sets[0] : sets);
				} else {
/* inialize sets with nodes */
					sets = nodes;
				}
			}
/* define sets length to clean up expando */
			idx = sets.length;
/*
Need this looping as far as we also have expando 'yeasss'
that must be nulled. Need this only to generic case
*/
			while (idx--) {
				sets[idx].yeasss = sets[idx].nodeIndex = sets[idx].nodeIndexLast = null;
			}
		}
	}
/* return and cache results */
	return _.c[selector] = sets;
};
/* cache for selected nodes, no leaks in IE detected */
_.c = [];
/* caching global document */
_.doc = document;
/* caching global window */
_.win = window;
/* function calls for CSS2/3 attributes selectors */
_.attr = {
/* W3C "an E element with a "attr" attribute" */
	'': function (child, attr) {
		return !!child.getAttribute(attr);
	},
/*
W3C "an E element whose "attr" attribute value is
exactly equal to "value"
*/
	'=': function (child, attr, value) {
		return (attr = child.getAttribute(attr)) && attr === value;
	},
/*
from w3.prg "an E element whose "attr" attribute value is
a list of space-separated values, one of which is exactly
equal to "value"
*/
	'&=': function (child, attr, value) {
		return (attr = child.getAttribute(attr)) && (new RegExp('(^| +)' + value + '($| +)').test(attr));
	},
/*
from w3.prg "an E element whose "attr" attribute value
begins exactly with the string "value"
*/
	'^=': function (child, attr, value) {
		return (attr = child.getAttribute(attr) + '') && !attr.indexOf(value);
	},
/*
W3C "an E element whose "attr" attribute value
ends exactly with the string "value"
*/
	'$=': function (child, attr, value) {
		return (attr = child.getAttribute(attr) + '') && attr.indexOf(value) == attr.length - value.length;
	},
/*
W3C "an E element whose "attr" attribute value
contains the substring "value"
*/
	'*=': function (child, attr, value) {
		return (attr = child.getAttribute(attr) + '') && attr.indexOf(value) != -1;
	},
/*
W3C "an E element whose "attr" attribute has
a hyphen-separated list of values beginning (from the
left) with "value"
*/
	'|=': function (child, attr, value) {
		return (attr = child.getAttribute(attr) + '') && (attr === value || !!attr.indexOf(value + '-'));
	},
/* attr doesn't contain given value */
	'!=': function (child, attr, value) {
		return !(attr = child.getAttribute(attr)) || !(new RegExp('(^| +)' + value + '($| +)').test(attr));
	}
};
/*
function calls for CSS2/3 modificatos. Specification taken from
http://www.w3.org/TR/2005/WD-css3-selectors-20051215/
on success return negative result.
*/
_.mods = {
/* W3C: "an E element, first child of its parent" */
	'first-child': function (child) {
/* implementation was taken from jQuery.1.2.6, line 1394 */
			return child.parentNode.getElementsByTagName('*')[0] !== child;
		},
/* W3C: "an E element, last child of its parent" */
	'last-child': function (child) {
			var brother = child;
/* loop in lastChilds while nodeType isn't element */
			while ((brother = brother.nextSibling) && brother.nodeType != 1) {}
/* Check for node's existence */
			return !!brother;
		},
/* W3C: "an E element, root of the document" */
	root: function (child) {
			return child.nodeName.toLowerCase() !== 'html';
		},
/* W3C: "an E element, the n-th child of its parent" */
	'nth-child': function (child, ind) {
		var i = child.nodeIndex || 0,
			a = ind[3] = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0,
			b = ind[1];
/* check if we have already looked into siblings, using exando - very bad */
		if (i) {
			return !( (i + a) % b);
		} else {
/* in the other case just reverse logic for n and loop siblings */
			var brother = child.parentNode.firstChild;
			i++;
/* looping in child to find if nth expression is correct */
			do {
/* nodeIndex expando used from Peppy / Sizzle/ jQuery */
				if (brother.nodeType == 1 && (brother.nodeIndex = ++i) && child === brother && ((i + a) % b)) {
					return 0;
				}
			} while (brother = brother.nextSibling);
			return 1;
		}
	},
/*
W3C: "an E element, the n-th child of its parent,
counting from the last one"
*/
	'nth-last-child': function (child, ind) {
/* almost the same as the previous one */
		var i = child.nodeIndexLast || 0,
			a = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0,
			b = ind[1];
		if (i) {
			return !( (i + a) % b);
		} else {
			var brother = child.parentNode.lastChild;
			i++;
			do {
				if (brother.nodeType == 1 && (brother.nodeLastIndex = i++) && child === brother && ((i + a) % b)) {
					return 0;
				}
			} while (brother = brother.previousSibling);
			return 1;
		}
	},
/*
Rrom w3.org: "an E element that has no children (including text nodes)".
Thx to John, from Sizzle, 2008-12-05, line 416
*/
	empty: function (child) {
			return !!child.firstChild;
		},
/* thx to John, stolen from Sizzle, 2008-12-05, line 413 */
	parent: function (child) {
			return !child.firstChild;
		},
/* W3C: "an E element, only child of its parent" */
	'only-child': function (child) {
			return child.parentNode.getElementsByTagName('*').length != 1;
		},
/*
W3C: "a user interface element E which is checked
(for instance a radio-button or checkbox)"
*/
	checked: function (child) {
			return !child.checked;
		},
/*
W3C: "an element of type E in language "fr"
(the document language specifies how language is determined)"
*/
	lang: function (child, ind) {
			return child.lang !== ind && _.doc.documentElement.lang !== ind;
		},
/* thx to John, from Sizzle, 2008-12-05, line 398 */
	enabled: function (child) {
			return child.disabled || child.type === 'hidden';
		},
/* thx to John, from Sizzle, 2008-12-05, line 401 */
	disabled: function (child) {
			return !child.disabled;
		},
/* thx to John, from Sizzle, 2008-12-05, line 407 */
	selected: function(elem){
/*
Accessing this property makes selected-by-default
options in Safari work properly.
*/
      child.parentNode.selectedIndex;
      return !child.selected;
    }
};
/* to handle DOM ready event */
_.isReady = 0;
/* dual operator for onload functions stack */
_.ready = function (fn) {
/* with param works as setter */
	if (typeof fn === 'function') {
		if (!_.isReady) {
			_.ready.list[_.ready.list.length] = fn;
/* after DOM ready works as executer */
		} else {
			fn();
		}
/* w/o any param works as executer */
	} else {
		if (!_.isReady){
			_.isReady = 1;
			var idx = _.ready.list.length;
			while (idx--) {
				_.ready.list[idx]();
			}
		}
	}
};
/* to execute functions on DOM ready event */
_.ready.list = [];
/* general event adding function */
_.bind = function (element, event, fn) {
	if (typeof element === 'string') {
		var elements = _(element),
			idx = 0;
		while (element = elements[idx++]) {
			_.bind(element, event, fn);
		}
	} else {
		event = 'on' + event;
		var handler = element[event];
		if (handler) {
			element[event] = function(){
				handler();
				fn();
			};
		} else {
			element[event] = fn;
		}
	}
}
/* browser sniffing */
_.ua = navigator.userAgent.toLowerCase();
/* cached check for querySelectorAll */
_.q = !!_.doc.querySelectorAll;
/* cached check for getElementsByClassName */
_.k = !!_.doc.getElementsByClassName;
/* code for DOM ready and browsers detection taken from jQuery */
_.browser = {
	safari: _.ua.indexOf('webkit') != -1,
	opera: _.ua.indexOf('opera') != -1,
	ie: _.ua.indexOf('msie') != -1 && _.ua.indexOf('opera') == -1,
	mozilla: _.ua.indexOf('mozilla') != -1 && (_.ua.indexOf('compatible') + _.ua.indexOf('webkit') == -2)
};
/*
Mozilla, Opera (see further below for it) and webkit nightlies
currently support this event
*/
if (_.doc.addEventListener && !_.browser.opera) {
/* Use the handy event callback */
	_.doc.addEventListener("DOMContentLoaded", _.ready, false);
}
/*
If IE is used and is not in a frame
Continually check to see if the document is ready
*/
if (_.browser.ie && _.win == top) {
	(function(){
		if (_.isReady) {
			return;
		}
/*
If IE is used, use the trick by Diego Perini
http://javascript.nwbox.com/IEContentLoaded/
*/
		try {
			_.doc.documentElement.doScroll("left");
		} catch(e) {
			setTimeout(arguments.callee);
			return;
		}
		_.ready();
	})();
}
if (_.browser.opera) {
	_.doc.addEventListener("DOMContentLoaded", function () {
			if (_.isReady) {
				return;
			}
			var i = 0,
				ss;
			while (ss = _.doc.styleSheets[i++]) {
				if (ss.disabled) {
					setTimeout(arguments.callee);
					return;
				}
			}
			_.ready();
		}, false);
}
if (_.browser.safari) {
	(function(){
		if (_.isReady) {
			return;
		}
		if ((_.doc.readyState !== "loaded" && _.doc.readyState !== "complete") || _.doc.styleSheets.length !== _('style,link[rel=stylesheet]').length) {
			setTimeout(arguments.callee);
			return;
		}
		_.ready();
	})();
}
/* to support old browsers */
_.bind(_.win, 'load', _.ready);
/*
hash of YASS modules: status and init. Statuses:
-1 (can't load)
0 (starting),
1 (loading),
2 (loaded),
3 (waiting for dependencies)
*/
_.modules = {'yass':[]};
/* async loader of javascript modules, main ideas are taken from jsx */
_.load = function (aliases, text) {
	var loader = function (alias, text, tries, aliases) {
		if (!(tries%100) && _.modules[alias].status < 2) {
			_.modules[alias].status = 0;
			if (!(tries -= 1000)) {
/* can't load module */
				_.modules[alias].status = -1;
				return;
			}
		}
		switch (_.modules[alias].status) {
/* module is already loaded, just execute onload */
			case 2:
				try {
/* try to eval onload handler */
					eval(text);
				} catch (a) {
				}
/* module is waiting for initialization */
			case 3:
				break;
/* module hasn't been loaded yet */
			default:
/* set module's status to loading. Threads in IE are amazing */
				_.modules[alias].status = 1;
				var script = _.doc.createElement('script');
				script.src = alias.indexOf('.js') + alias.indexOf('/') != -2 ? alias : 'yass.' + alias + '.js';
				script.type = 'text/javascript';
/* to handle script.onload event */
				script.text = text || '';
/* to fill hash of loaded scripts */
				script.title = alias;
/* script onload for IE */
				script.onreadystatechange = function() {
					if (this.readyState === 'complete') {
/* run onload handlers logic */
						_.postloader(this);
					}
				};
				script.onload = function (e) {
					_.postloader(e.srcElement || e.target);
				};
				_('head')[0].appendChild(script);
/* module is loading, re-check in 100 ms */
			case 1:
				setTimeout(function () {
					loader(alias, text, --tries, aliases)
				}, 10);
				break;
		}
	},
		idx = 0,
		alias,
		a;
/* 
we can define several modules for 1 component:
yass-module-item1-item2-item3
*/
	aliases = aliases.split("-");
	while (alias = aliases[idx++]) {
/* create module in YASS */
		if (!_.modules[alias]) {
			_.modules[alias] = {};
/* for faster for-in loop */
			_.modules['yass'][_.modules['yass'].length] = alias;
		}
/*
to lock this module load status untill all dependencies 
will be resolved
*/
		_.modules[alias].deps = _.modules[alias].deps || {'yass':[]};
/* to count loaded / not loaded dependencies */
		_.modules[alias].notloaded = _.modules[alias].notloaded || 0;
/* 
the first module goes w/o any dependencies
don't include original alias and make array unique
also track cases when module is already loaded
*/
		if ((a = aliases[idx-2]) && a !== alias && !_.modules[alias].deps[a]) {
			_.modules[alias].deps[a] = 1;
/* for faster for-in loop */
			_.modules[alias].deps['yass'][_.modules[alias].deps['yass'].length] = a;
			_.modules[alias].notloaded++;
		}
/* prevent race conditions */
		if (typeof _.modules[alias].status === 'undefined') {
			_.modules[alias].status = 0;
/* 11999 = 1000 * 11 reload attempts + 100 checks * 10 reload attempts - 1 */
			loader(alias, text, 11999, aliases);
		}
	}
}
/* handle all handlers' logic of module's onload */
_.postloader = function (e) {
/* evaling innerHTML for script only for Opera */
	if (_.browser.opera) {
		try {
/* try to eval onload handler */
			eval(e.innerHTML);
		} catch (a) {
		}
	}
	var module = _.modules[e.title],
/* try to resolve dependencies */
		aliases = module.deps['yass'],
		idx = aliases.length - 1;
/* set status to waiting */
	module.status = 3;
/*
if something isn't loaded yet - count this
to handle last module onload
*/
	while (aliases[idx] && _.modules[aliases[idx]].status == 2 && idx--) {}
/* if there is more than one module to load - wait futher */
	if (idx > -1) {
		return;
	}
/* on success mark this module as loaded */
	module.status = 2;
/* if any handler is attached for module onload - run it */
	if (module.init) {
		module.init();
	}
	var modules = _.modules['yass'],
		recursive = function(title) {
			var dep,
				alias,
				idx = 0;
			while (alias = modules[idx++]) {
				dep = _.modules[alias];
/* resolve all dependencies that are tied to this module */
				if (dep.deps[title] && !(--dep.notloaded) && dep.status == 3) {
						dep.status = 2;
/* if any handler is attached for module onload - run it */
						if (dep.init) {
							dep.init();
						}
						recursive(alias);
				}
			}
		};
	recursive(e.title);
}
/* initialize as a global var and don't override window._ */
_.win._ = _.win._ || (_.win.yass = _);
})();

/* autoload of modules */
_.ready(function() {
	var modules = _('[class^=yass-module-]'),
		item,
		len = modules.length,
		idx = 0;
	while (idx < len) {
		item = modules[idx++];
/* script filename should be equal to yass.[module name].js */
		_.load(item.className.slice(item.className.indexOf('yass-module-') + 12), item.title);
		item.title = null;
	}
});

/* js-core JavaScript framework, version 2.7.6 (compact version for integration with CSS-selector engine)
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
/* js-core AJAX module, version 0.2.5
   Copyright (c) 2009 Dmitry Korobkin
   Released under the MIT License.
   More information: http://www.js-core.ru/
	Warning: do not use timeout for more then 2 XHR at one time!
*/
core.ajax = function() {
	if(this.ajax) return new this.ajax();
	this.xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
};
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
		var params = [], process = this.process;
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
		this.xhr.onreadystatechange = function() {
			if(ajax.xhr.readyState == 4) {
				if(ajax.xhr.status == 200 || ajax.xhr.status == 0 && ajax.success) ajax.success(ajax.xhr.responseText);
				else if(ajax.error && !ajax.aborted) ajax.error(ajax.xhr.statusText);
			}
		};
		this.xhr.send(this.params);;
		if(this.async && this.timeout) setTimeout(function() {
			if(ajax.xhr.readyState != 4) {
				ajax.aborted = true;
				ajax.xhr.abort();
				if(ajax.error) ajax.error('Time is out');
			}
		}, this.timeout);
	}
	catch(error) {
		if(this.error) this.error(error);
	}
};
core.get = function(params, success, error) {
	new core.ajax().open(core.extend(params, {success: success, error: error}));
	return this;
};
core.post = function(params, success, error) {
	new core.ajax().open(core.extend(params, {method: 'POST', success: success, error: error}));
	return this;
};
core.getJSON = function(params, callback, error) {
	new core.ajax().open(core.extend(params, {dataType: 'json', success: function(response) {
		try {
			callback(eval('(' + response + ')'));
		}
		catch(error) {
			if(this.error) this.error(error);
		}
	}, error: error}));
	return this;
};
core.prototype.load = function(params, success, error) {
	var _this = this;
	new core.ajax().open(core.extend(params, {success: function(response) {
		_this.html(response);
		if(success) success.call(_this.node, response, this.xhr);
	}, error: function(response) {
		if(error) error.call(_this.node, response, this.xhr);
	}}));
	return this;
};
win.core = win.$ ? core : (win.$ = core);
})(window, document, function(arg) {
	if(this.core) return new core(arg);
	this.node = core.id(arg);
} /*@cc_on , ScriptEngineMinorVersion() @*/);

/**
 * Integration
 */
window.$$ = core.query = function(selector, root, noCache) {
	return new core.list(_(selector, root, noCache), false);
};
core.prototype.query = function(selector, noCache) {
	return new core.list(_(selector, this.node, noCache), false);
};
core.browser = _.browser;
core.ready = _.ready;
core.load = _.load;