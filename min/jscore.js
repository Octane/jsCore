//jsCore v0.4.6-alpha IE8+ github.com/Octane/jsCore
!function(t,n,e,r,i,o,a,u,s,c,f,l,h,p,d,m,g){"use strict";function v(){}var y=y||Element;"textContent"in n.documentElement||e.defineProperty(y.prototype,"textContent",{get:function(){return this.innerText},set:function(t){this.innerText=t}}),"textContent"in n.createTextNode("test")||e.defineProperty(Text.prototype,"textContent",{get:function(){return this.nodeValue},set:function(t){this.nodeValue=t}}),"head"in n||e.defineProperty(n,"head",{get:function(){return this.query("head")}}),{toString:null}.propertyIsEnumerable("toString")||new function(){var t=["constructor","toString","toLocaleString","valueOf","hasOwnProperty","propertyIsEnumerable","isPrototypeOf"];e.keys=function(n){var r,i=t.length,o=[],a=0;for(r in n)e.hasOwnProperty.call(n,r)&&(o[a++]=r);for(;i--;)r=t[i],e.hasOwnProperty.call(n,r)&&(o[a++]=r);return o}},e.create||(e.create=function(t,n){function e(){}if(n)throw new l("Object.create implementation only accepts the 1st parameter");return e.prototype=t,new e});var w=t instanceof e||new function(){function t(){var t;return{get:function(){return t},set:function(n){t=n}}}function n(n){return e.defineProperty(n,"length",t())}return new function(){function t(){return n(e.getElementsByName(i++))}var e=new ActiveXObject("htmlfile"),r=t().constructor.prototype,i=0;return r.urns=void 0,r.tags=void 0,r.item=void 0,r.namedItem=void 0,r=null,t}};r.isArray||(r.isArray=function(t){return"[object Array]"==e.prototype.toString.call(t)}),r.prototype.forEach||(r.prototype.forEach=function(t,n){for(var e=this.length,r=0;e>r;)r in this&&t.call(n,this[r],r,this),r++}),r.prototype.map||(r.prototype.map=function(t,n){for(var e=[],r=this.length,i=0;r>i;)i in this&&(e[i]=t.call(n,this[i],i,this)),i++;return e}),r.prototype.indexOf||(r.prototype.indexOf=function(t){for(var n=this.length,e=0;n>e;){if(e in this&&this[e]===t)return e;e++}return-1}),r.prototype.lastIndexOf||(r.prototype.lastIndexOf=function(t){for(var n=this.length;n--;)if(n in this&&this[n]===t)return n;return-1}),r.prototype.filter||(r.prototype.filter=function(t,n){for(var e=[],r=this.length,i=0;r>i;)i in this&&t.call(n,this[i],i,this)&&e.push(this[i]),i++;return e}),r.prototype.every||(r.prototype.every=function(t,n){for(var e=this.length,r=0;e>r;){if(r in this&&!t.call(n,this[r],r,this))return!1;r++}return!0}),r.prototype.some||(r.prototype.some=function(t,n){for(var e=this.length,r=0;e>r;){if(r in this&&t.call(n,this[r],r,this))return!0;r++}return!1}),r.prototype.reduce||(r.prototype.reduce=function(t,n){var e,r=this.length,i=0;if(arguments.length<2){if(!r)throw new h("Reduce of empty array with no initial value");for(;r>i;){if(i in this){e=this[i],i++;break}i++}}else e=n;for(;r>i;)i in this&&(e=t(e,this[i],i,this)),i++;return e}),r.prototype.reduceRight||(r.prototype.reduceRight=function(t,n){var e,r=this.length;if(arguments.length<2){if(!this.length)throw new h("Reduce of empty array with no initial value");for(;r--;)if(r in this){e=this[r];break}}else e=n;for(;r--;)r in this&&(e=t(e,this[r],r,this));return e}),i.bind||(i.prototype.bind=new function(){function n(n,e){for(var r=[],o=e.length,a=0;o>a;)r.push("arg"+a),a++;return r=r.join(","),new i("Constructor",r,"return new Constructor("+r+")").apply(t,[n].concat(e))}return function(t){function e(){function a(){}var u,s,c;if(e._protoMagic)return e._protoMagic=!1,a.prototype=this,a.prototype.constructor=o,new a;if(s=i.concat(r.from(arguments)),c=s.length,this instanceof e){switch(e._protoMagic=!0,c){case 0:u=new o;break;case 1:u=new o(s[0]);break;case 2:u=new o(s[0],s[1]);break;default:u=n(o,s)}return a.prototype=u,e.prototype=new a,e.prototype.constructor=e,new e}switch(c){case 0:return o.call(t);case 1:return o.call(t,s[0]);case 2:return o.call(t,s[0],s[1])}return o.apply(t,s)}var i=r.slice(arguments,1),o=this;if("function"!=typeof o)throw new h("Function.prototype.bind called on non-function");return e._protoMagic=!1,e}}),o.prototype.trim||(o.prototype.trim=new function(){var t,n,e;return t="	\n\f\r   ᠎ ",t+="        ",t+="    　\u2028\u2029﻿",t="["+t+"]",e=new c("^"+t+t+"*"),n=new c(t+t+"*$"),function(){return this.replace(e,"").replace(n,"")}}),s.now||(s.now=function(){return(new s).getTime()}),function(){var t=e.create({});return t[0]=null,t.hasOwnProperty(0)}()||new function(){var t=e.create;e.create=function(n,r){var i=t(n,r);return e.hasOwnProperty.call(i,0)||(e.defineProperty(i,0,{configurable:!0}),delete i[0]),i}},e.assign||(e.assign=function(t){return r.prototype.slice.call(arguments,1).forEach(function(n){e.keys(n).forEach(function(e){t[e]=n[e]})}),t}),e.is||(e.is=function(t,n){return 0===t&&0===n?1/t===1/n:t!==t?n!==n:t===n}),r.from||(r.from=function(t,n,i){return e(t).length?n?r.map(t,n,i):r.slice(t,0):[]}),r.of||(r.of=function(){return r.from(arguments)}),r.prototype.find||(r.prototype.find=function(t,n){for(var e,r=this.length,i=0;r>i;){if(i in this&&(e=this[i],t.call(n,e,i,this)))return e;i++}return void 0}),r.prototype.findIndex||(r.prototype.findIndex=function(t,n){for(var e,r=this.length,i=0;r>i;){if(i in this&&(e=this[i],t.call(n,e,i,this)))return i;i++}return-1}),r.prototype.fill||(r.prototype.fill=function(t,n,e){var r,i=this.length;n=a(n)||0,e=2 in arguments?a(e)||0:i,r=0>n?f.max(i+n,0):f.min(n,i),e=0>e?f.max(i+e,0):f.min(e,i);for(;e>r;)this[r]=t,r++;return this}),o.prototype.startsWith||(o.prototype.startsWith=function(t,n){return n||(n=0),this.indexOf(t,n)==n}),o.prototype.endsWith||(o.prototype.endsWith=function(t,n){var e;return n=n||this.length,n-=t.length,e=this.lastIndexOf(t),-1!=e&&e==n}),o.prototype.contains||(o.prototype.contains=function(t,n){return-1!=this.indexOf(t,n||0)}),o.prototype.repeat||(o.prototype.repeat=function(t){return new r(t+1).join(this)}),a.isFinite||(a.isFinite=function(t){return"number"==typeof t&&p(t)}),a.isInteger||(a.isInteger=function(t){return"number"==typeof t&&p(t)&&t>-9007199254740992&&9007199254740992>t&&f.floor(t)==t}),a.isNaN||(a.isNaN=function(t){return"number"==typeof t&&d(t)}),a.parseInt||(a.parseInt=g),a.parseFloat||(a.parseFloat=m),f.trunc||(f.trunc=function(t){return t=a(t),d(t)||0===t||!a.isFinite(t)?t:f.sign(t)*f.floor(f.abs(t))}),f.sign||(f.sign=function(t){return 0===t||d(t)?t:(t>0)-(0>t)}),new function(){function t(t,n){var e=n[0];switch(n.length){case 1:return t.call(e);case 2:return t.call(e,n[1]);case 3:return t.call(e,n[1],n[2])}return t.apply(e,r.prototype.slice.call(n,1))}function n(n){return function(){return t(n,arguments)}}function i(t,e){return e.reduce(function(e,r){return e[r]=n(t[r]),e},{})}function a(t,n){e.keys(n).forEach(function(e){e in t||(t[e]=n[e])})}a(r,i(r.prototype,["concat","every","fill","filter","find","findIndex","forEach","indexOf","join","lastIndexOf","map","pop","push","reduce","reduceRight","reverse","shift","slice","some","sort","splice","unshift"])),a(o,i(o.prototype,["charAt","charCodeAt","concat","contains","endsWith","indexOf","lastIndexOf","match","repeat","replace","search","slice","split","startsWith","substr","substring","toLowerCase","toUpperCase","trim"]))},t.Set||(t.Set=new function(){function t(){if(arguments.length)throw l("Set implementation doesn't accept parameters");this.length=0}return e.assign(t.prototype,{size:0,add:function(t){this.has(t)||(this.size=r.push(this,t))},has:function(t){return-1!=r.findIndex(this,function(n){return e.is(t,n)})},"delete":function(t){var n=r.findIndex(this,function(n){return e.is(t,n)});return-1==n?!1:(r.splice(this,n,1),this.size--,!0)},clear:function(){r.splice(this,0,this.length),this.size=0}}),t}),t.Map||(t.Map=new function(){function t(){if(arguments.length)throw l("Map implementation doesn't accept parameters");this.length=0}var n=0,i=1;return e.assign(t.prototype,{size:0,_getPair:function(t){return r.find(this,function(r){return e.is(t,r[n])})},set:function(t,n){var e=this._getPair(t);e?e[i]=n:this.size=r.push(this,[t,n])},get:function(t){return e(this._getPair(t))[i]},has:function(t){return u(this._getPair(t))},"delete":function(t){var i=r.findIndex(this,function(r){return e.is(t,r[n])});return-1==i?!1:(r.splice(this,i,1),this.size--,!0)},clear:function(){r.splice(this,0,this.length),this.size=0}}),t}),t.WeakSet||(t.WeakSet=new function(){function t(){if(arguments.length)throw l("WeakSet implementation doesn't accept parameters");this.length=0}function n(t){return this===t}function i(t){if(e(t)!==t)throw h("Invalid value used in weak set");return t}return e.assign(t.prototype,{add:function(t){this.has(i(t))||r.push(this,t)},has:function(t){return-1!=r.findIndex(this,n,i(t))},"delete":function(t){var e=r.findIndex(this,n,i(t));return-1==e?!1:(r.splice(this,e,1),!0)},clear:function(){r.splice(this,0,this.length)}}),t}),t.WeakMap||(t.WeakMap=new function(){function t(){if(arguments.length)throw l("WeakMap implementation doesn't accept parameters");this.length=0}function n(t){return this===t[o]}function i(t){if(e(t)!==t)throw h("Invalid value used as weak map key");return t}var o=0,a=1;return e.assign(t.prototype,{_getPair:function(t){return r.find(this,n,i(t))},set:function(t,n){var e=this._getPair(t);e?e[a]=n:r.push(this,[t,n])},get:function(t){return e(this._getPair(t))[a]},has:function(t){return u(this._getPair(t))},"delete":function(t){var e=r.findIndex(this,n,i(t));return-1==e?!1:(r.splice(this,e,1),!0)},clear:function(){r.splice(this,0,this.length)}}),t}),t instanceof e||e.assign(t,new function(){function e(n){var e=n[0];switch(n.length){case 1:return e();case 2:return e(n[1]);case 3:return e(n[1],n[2])}return e.apply(t,r.prototype.slice.call(n,1))}var i=0,o={};return{setImmediate:function(){function t(){this.onreadystatechange=null,n.removeChild(this),o[a]&&(delete o[a],e(r))}var r=arguments,a=i++;return o[a]=!0,new function(){var e=n.createElement("script");e.onreadystatechange=t,n.appendChild(e)},a},clearImmediate:function(t){delete o[t]}}}),t.setImmediate||e.assign(t,new function(){function n(n){var e=n[0];switch(n.length){case 1:return e();case 2:return e(n[1]);case 3:return e(n[1],n[2])}return e.apply(t,r.prototype.slice.call(n,1))}function e(t){var e,r=t.data;"string"==typeof r&&r.startsWith(u)&&(e=o[r],e&&(delete o[r],n(e)))}var i=0,o={},a=!0,u="setImmediatePolyfillMessage";return{setImmediate:function(){var n=i++,r=u+n;return o[r]=arguments,a&&(a=!1,t.addEventListener("message",e)),t.postMessage(r,"*"),n},clearImmediate:function(t){delete o[u+t]}}}),t.Promise||(t.Promise=new function(){function n(n){return i(n)?n:new l(function(e,r){t.setImmediate(function(){try{n.then(e,r)}catch(t){r(t)}})})}function i(t){return t instanceof l}function o(t){return"then"in e(t)}function a(t){return t._fulfilled||t._rejected}function u(t){return r.every(t,a)}function s(t){return t}function c(t){throw t}function f(t){t()}function l(t){e.assign(this,{_fulfilled:!1,_rejected:!1,_value:void 0,_reason:void 0,_onFulfilled:[],_onRejected:[]}),this._resolve(t)}return e.assign(l,{resolve:function(t){return o(t)?n(t):new l(function(n){n(t)})},reject:function(t){return new l(function(n,e){e(t)})},race:function(t){return new l(function(e,i){r.forEach(t,function(t){n(t).then(e,i)})})},all:function(t){return new l(function(e,i){var o=[];t=r.map(t,n),t.forEach(function(n,r){n.then(function(n){o[r]=n,u(t)&&e(o)},i)})})}}),e.assign(l.prototype,{_resolve:function(t){function n(t){r._fulfill(t)}function e(t){r._reject(t)}var r=this;try{t(n,e)}catch(i){a(r)||e(i)}},_fulfill:function(t){a(this)||(this._fulfilled=!0,this._value=t,this._onFulfilled.forEach(f),this._clearQueue())},_reject:function(t){a(this)||(this._rejected=!0,this._reason=t,this._onRejected.forEach(f),this._clearQueue())},_enqueue:function(t,n){this._onFulfilled.push(t),this._onRejected.push(n)},_clearQueue:function(){this._onFulfilled=[],this._onRejected=[]},then:function(e,r){var i=this;return new l(function(a,u){function f(){t.setImmediate(function(){var t;try{t=e(i._value)}catch(r){return void u(r)}o(t)?n(t).then(a,u):a(t)})}function l(){t.setImmediate(function(){var t;try{t=r(i._reason)}catch(e){return void u(e)}o(t)?n(t).then(a,u):a(t)})}e=e||s,r=r||c,i._fulfilled?f():i._rejected?l():i._enqueue(f,l)})},"catch":function(t){return this.then(void 0,t)}}),l}),t.requestAnimationFrame||e.assign(t,{requestAnimationFrame:[t.msRequestAnimationFrame,t.mozRequestAnimationFrame,t.webkitRequestAnimationFrame,new function(){var n=60,e=1e3/n,r=s.now(),i=r;return function(n){var o=s.now(),a=f.max(0,e-(o-i)),u=o+a;return i=u,t.setTimeout(function(){n(u-r)},a)}}].find(u),cancelAnimationFrame:[t.mozCancelAnimationFrame,t.webkitCancelAnimationFrame,t.cancelRequestAnimationFrame,t.msCancelRequestAnimationFrame,t.mozCancelRequestAnimationFrame,t.webkitCancelRequestAnimationFrame,t.clearTimeout].find(u)}),"dataset"in n.documentElement||e.defineProperty(y.prototype,"dataset",{get:new function(){function t(t){return t.charAt(1).toUpperCase()}function n(n){return n.substr(5).replace(/-./g,t)}function i(t){return{get:function(){return t.value},set:function(n){t.value=o(n)}}}function a(t,o){return r.forEach(o,function(r){var o=r.name.toLowerCase();o.startsWith("data-")&&e.defineProperty(t,n(o),i(r))}),t}return function(){return a(new v,this.attributes)}}}),"children"in n.createDocumentFragment()||new function(){function t(t){t in r||e.defineProperty(r,t,{get:o[t]})}var r,i=1,o={firstElementChild:function(){for(var t=this.firstChild;t&&i!=t.nodeType;)t=t.nextSibling;return t},lastElementChild:function(){for(var t=this.lastChild;t&&i!=t.nodeType;)t=t.previousSibling;return t},nextElementSibling:function(){var t=this;do t=t.nextSibling;while(t&&i!=t.nodeType);return t},previousElementSibling:function(){var t=this;do t=t.previousSibling;while(t&&i!=t.nodeType);return t},childElementCount:function(){return this.children.length},children:new function(){function t(){}return t.prototype.item=function(t){return this[t]||null},function(){for(var n,e=new t,r=this.childNodes,o=r.length,a=0,u=0;o>a;)n=r[a],i==n.nodeType&&(e[u++]=n),a++;return e.length=u,e}}};r=y.prototype,e.keys(o).forEach(t),[n.constructor,n.createDocumentFragment().constructor].forEach(function(n){r=n.prototype,["firstElementChild","lastElementChild","childElementCount","children"].forEach(t)})},"append"in n.createDocumentFragment()||new function(){function t(t,n,e){return-1!=r.indexOf(t.querySelectorAll(e),n)}function i(t){var e,i,o,a=t.length;if(1==a)return e=t[0],"string"==typeof e?n.createTextNode(e):e;for(i=n.createDocumentFragment(),t=r.from(t),o=0;a>o;)e=t[o],"string"==typeof e&&(e=n.createTextNode(e)),i.appendChild(e),o++;return i}function o(t){t in s||(s[t]=c[t])}var a=1,s=y.prototype,c={before:function(){var t=this.parentNode;t&&t.insertBefore(i(arguments),this)},after:function(){var t,n,e=this.parentNode;e&&(n=i(arguments),t=this.nextSibling,t?e.insertBefore(n,t):e.appendChild(n))},replace:function(){var t=this.parentNode;t&&t.replaceChild(i(arguments),this)},remove:function(){var t=this.parentNode;t&&t.removeChild(this)},append:function(){this.appendChild(i(arguments))},prepend:function(){this.insertBefore(i(arguments),this.firstChild)},query:function(t){return this.querySelector(t)},queryAll:function(t){return this.querySelectorAll(t)},matches:[s.matchesSelector,s.oMatchesSelector,s.msMatchesSelector,s.mozMatchesSelector,s.webkitMatchesSelector,function(e){var r,i;return this===n?!1:(i=this.parentNode)?(a==i.nodeType&&(i=i.ownerDocument),t(i,this,e)):(i=n.createDocumentFragment(),i.appendChild(this),r=t(i,this,e),void i.removeChild(this))}].find(u)};e.keys(c).forEach(o),s=n.constructor.prototype,["query","queryAll"].forEach(o),s=n.createDocumentFragment().constructor.prototype,["append","prepend","query","queryAll","matches"].forEach(o)},"classList"in n.documentElement||e.defineProperty(y.prototype,"classList",{get:new function(){function t(t,n){this._getTokens=t,this._onChange=n}function n(t){return t=t.trim(),t?t.split(/\s\s*/):[]}return e.assign(t.prototype,{_clear:function(){r.splice(this,0,this.length)},_push:function(t){r.prototype.push.apply(this,t)},_update:function(){this._clear(),this._push(this._getTokens())},item:function(t){return this._update(),this[t]||null},add:function(){var t;this._update(),t=this.length,r.forEach(arguments,function(t){-1==r.indexOf(this,t)&&r.push(this,t)},this),t!=this.length&&this._onChange()},remove:function(){var t;this._update(),t=this.length,r.forEach(arguments,function(t){var n=r.indexOf(this,t);-1!=n&&r.splice(this,n,1)},this),t!=this.length&&this._onChange()},toggle:function(t,n){return this._update(),n===!1||this.contains(t)?(this.remove(t),!1):(this.add(t),!0)},contains:function(t){return this._update(),-1!=r.indexOf(this,t)},toString:function(){return r.join(this," ")}}),function(){var e=this;return e._classList||(e._classList=new t(function(){return n(e.className)},function(){e.className=this.toString()})),e._classList._update(),e._classList}}}),t.FormData||(t.FormData=new function(){function t(t){this.boundary=n(),t&&r.prototype.push.apply(this,i(t))}var n=new function(){function t(){var e=f.random().toString().slice(2);return n[e]?t():(n[e]=1,e)}var n={};return function(){return"-------------------------"+t()}},i=new function(){function t(t){return t.selected}function n(n){var e=n.nodeName.toLowerCase(),i=n.type;return n.name?n.disabled?!1:"fieldset"==e?!1:"select"==e&&n.multiple?r.some(n.options,t):"submit"==i||"reset"==i||"button"==i||"file"==i?!1:"radio"!=i&&"checkbox"!=i||!n.checked?!0:!1:!1}function e(n){return"select"==n.tagName.toLowerCase()&&n.multiple?r.reduce(n.options,function(n,e){return t(e)&&n.push(e.value),n},[]):[n.value]}return function(t){return r.reduce(t.elements,function(t,r){return n(r)&&e(r).forEach(function(n){t.push({name:r.name,value:n})}),t},[])}};return e.assign(t.prototype,{notNative:!0,append:function(t,n,e){r.push(this,{name:t,value:n,fileName:e})},toString:function(){var t=this.boundary,n="";return r.forEach(this,function(r){var i,o=r.name,a=r.value;n+="--"+t+"\r\n",e(a)===a?(i=r.fileName||a.name,n+='Content-Disposition: form-data; name="',n+=o+'"; filename="'+i+'"\r\n',n+="Content-Type: "+a.type+"\r\n\r\n",n+=a.content+"\r\n"):(n+='Content-Disposition: form-data; name="',n+=o+'"\r\n\r\n',n+=a+"\r\n")}),n+="--"+t+"--"}}),XMLHttpRequest.prototype.send=new function(){var n=XMLHttpRequest.prototype.send;return function(e){e instanceof t&&(this.setRequestHeader("Content-Type","multipart/form-data; boundary="+e.boundary),e=e.toString()),n.call(this,e)}},t}),new function(){function t(t){for(var n=[],e=t.length,r=0;e>r;)n[r]=t[r],r++;return n}var i=r.prototype.slice;try{r.slice(n.documentElement.childNodes,0)}catch(o){r.slice=function(n,r,o){var a,u=arguments.length;return a=e(n)instanceof e?n:t(n),1==u||2==u&&0==r?a==n?i.call(a,0):a:2==u?i.call(a,r):i.call(a,r,o)}}},function(){var t={0:!0,length:1};return r.splice(t,0,1),t[0]}()&&new function(){var t=r.splice;r.splice=function(n,e,i){var o,a=t.apply(r,arguments);if(!(n instanceof r))for(o=n.length;i--;)delete n[o+i];return a}},"function"==typeof w&&(v=w),function(){var t=n.createElement("div");return t.appendChild(n.createComment("test")),t.children.length}()&&e.defineProperty(y.prototype,"children",{get:e.getOwnPropertyDescriptor(HTMLDocument.prototype,"children").get}),t.addEventListener||new function(){function t(t){var e=n.documentElement;t.pageX=t.clientX+e.scrollLeft,t.pageY=t.clientY+e.scrollTop,t.timeStamp||(t.timeStamp=s.now())}function r(n,e){return function(r){var i,o=n.slice(0),a=o.length,u=0;for(r instanceof d||t(r),r.currentTarget=e;a>u;)i=o[u],i.handleEvent?i.handleEvent(r):i.call(e,r),u++}}function i(t,n,e){var i,o,a,u,s=this;if(e)throw new l("Capturing phase is not supported");s._events||(s._events={}),o=s._events,u=m[t],u&&(t=u.eventType),a=o[t],a||(a={callbacks:[]},i=r(a.callbacks,s),u&&(i=u.decorateListener(i)),a.listener=i,o[t]=a,this.attachEvent("on"+t,i)),-1==a.callbacks.indexOf(n)&&a.callbacks.push(n)}function o(t,n,e){var r,i,o,a,u,s=this;if(e)throw new l("Capturing phase is not supported");s._events&&(i=s._events,u=m[t],u&&(t=u.eventType),i[t]&&(o=i[t],r=o.callbacks,a=r.indexOf(n),-1!=a&&(r.splice(a,1),r.length||(s.detachEvent("on"+t,o.listener),delete i[t]))))}function a(t){var n,e,r=t.type;return t instanceof d?(t.target=this,n=this._events,n&&n[r]&&n[r].listener(t)):(e=m[r],e&&(r=e.eventType),this.fireEvent("on"+r,t)),!t.defaultPrevented}function u(t,n,r){e.assign(this,{type:t,bubbles:n,cancelable:r})}function c(t,n,r,i,o){this.initEvent(t,n,r),e.assign(this,{view:i,detail:o})}function f(t,n,r,i,o,a,u,s,c,f,l,h,p,d,m){this.initUIEvent(t,n,r,i,o),e.assign(this,{screenX:a,screenY:u,clientX:s,clientY:c,ctrlKey:f,altKey:l,shiftKey:h,metaKey:p,button:d,fromElement:m})}function h(){this.defaultPrevented=!0,this.returnValue=!1}function p(){this.cancelBubble=!0}function d(){}var m={DOMContentLoaded:{eventType:"readystatechange",decorateListener:function(t){return function(e){"complete"==n.readyState&&t(e)}}}};e.assign(d.prototype,{type:"",timeStamp:0,detail:null,target:null,currentTarget:null,defaultPrevented:!1,preventDefault:h,stopPropagation:p,initEvent:u,initCustomEvent:function(t,n,e,r){this.initEvent(t,n,e),this.detail=r}}),e.assign(Event.prototype,{timeStamp:0,currentTarget:null,defaultPrevented:!1,preventDefault:h,stopPropagation:p,initEvent:u}),e.defineProperty(Event.prototype,"target",{get:function(){return this.srcElement}}),e.defineProperty(Event.prototype,"relatedTarget",{get:function(){return this.fromElement===this.srcElement?this.toElement:this.fromElement}}),[y,HTMLDocument,Window,XMLHttpRequest].forEach(function(t){var n=t.prototype;n.dispatchEvent=a,n.addEventListener=i,n.removeEventListener=o}),HTMLDocument.prototype.createEvent=function(t){var n;return t.startsWith("CustomEvent")?n=new d:(n=this.createEventObject(),t.startsWith("UIEvent")?n.initUIEvent=c:t.startsWith("MouseEvent")&&(n.initUIEvent=c,n.initMouseEvent=f)),n.timeStamp=s.now(),n}},"onload"in new XMLHttpRequest||new function(){var r=XMLHttpRequest.prototype,i=r.abort,o=r.send,a=r.open;e.assign(r,{UNSENT:0,OPENED:1,HEADERS_RECEIVED:2,LOADING:3,DONE:4,_unbind:function(){this.onreadystatechange=null},_fireEvent:function(e){var r=n.createEvent("CustomEvent");r.initEvent(e,!1,!1),this.dispatchEvent(r),e="on"+e,this[e]&&t.setImmediate(function(){r.target[e](r)})},_onReadyStateChange:function(){this.readyState==this.DONE&&(this._unbind(),this._fireEvent("load"))},open:function(){try{a.apply(this,arguments)}catch(t){this._unbind(),this._fireEvent("error")}},send:function(t){this.onreadystatechange=this._onReadyStateChange;try{o.call(this,t)}catch(n){this._unbind(),this._fireEvent("error")}},abort:function(){i.call(this),this._fireEvent("abort")}})},"onload"in n.createElement("script")||e.defineProperty(HTMLScriptElement.prototype,"onload",{set:function(t){this.onreadystatechange="function"==typeof t?function(e){"loaded"==this.readyState&&(this.onreadystatechange=null,e=n.createEvent("CustomEvent"),this.text?(e.initEvent("load",!1,!1),t.call(this,e)):this.onerror&&(e.initEvent("error",!1,!1),this.onerror(e)),this.onerror=null)}:null}}),t instanceof e||new function(){function t(t){return t.charAt(1).toUpperCase()}function n(n){return n.replace(/-./g,t)}function r(t,n){return t.replace("{ENABLED}",1!=n)}function i(t){return r(l.replace("{VALUE}",f.trunc(100*t)),t)}function a(t,n){return t.replace(p,i(n))}function u(t){return t.toLowerCase().contains("alpha")}var s=CSSStyleDeclaration.prototype,c="progid:DXImageTransform.Microsoft.",l="Alpha(opacity={VALUE}, enabled={ENABLED})",h=/\bopacity\s*=\s*(\d+)/i,p=/alpha\s*\(.*?\)/i;e.defineProperty(s,"cssFloat",{get:function(){return this.styleFloat},set:function(t){this.styleFloat=t}}),e.defineProperty(s,"opacity",{get:function(){var t="",n=this.filter.trim();return n&&n.replace(p,function(n){n.replace(h,function(n,e){t=o(e/100)})}),t},set:function(t){var n=this.filter.trim();!t||t>1?t=1:0>t&&(t=0),n?u(n)?this.filter=a(n,t):this.filter+=" "+c+i(t):this.filter=c+i(t)}}),e.assign(s,{getPropertyValue:function(t){return t=t.toLowerCase(),"float"==t?this.styleFloat:this[n(t)]},removeProperty:function(t){var e;return t=t.toLowerCase(),"float"==t?(t="styleFloat",e=this.styleFloat):(t=n(t),e=this[t]),this[t]="",e},setProperty:function(t,e){t=t.toLowerCase(),"float"==t&&(this.styleFloat=e),this[n(t)]=e}})},t.getComputedStyle||(t.getComputedStyle=new function(){function t(t){return t.charAt(1).toUpperCase()}function n(n){return n.replace(/-./g,t)}function r(t){return t=t.toLowerCase(),"float"==t?this.cssFloat:this[n(t)]}function i(t,n){return{get:function(){return t[n]}}}function a(t){return{get:function(){return t.styleFloat}}}function u(t){return{get:function(){var n=t["DXImageTransform.Microsoft.Alpha"]||t.alpha;return n?o(n.opacity/100):"1"}}}function s(t,n){if(n)throw new l("getComputedStyle implementation only accepts the 1st parameter");var o,s=t._compStyle;return s||(s=t._compStyle=new w,o=t.currentStyle,e.keys(o).forEach(function(t){e.defineProperty(s,t,i(o,t))}),e.defineProperty(s,"cssFloat",a(o)),e.defineProperty(s,"opacity",u(t.filters)),s.getPropertyValue=r),s}return s}),history.pushState||new function(){function r(){var e=n.createEvent("CustomEvent");e.initEvent("popstate",!1,!1),e.state=u,t.dispatchEvent(e)}console.log("history polyfill");var i=history.constructor.prototype,o=t.location,a={},u=null,s={};i.pushState=function(t,n,e){e.startsWith("#")||(e="#"+e),a[e]=t,s[e]=!0,o.hash=e},i.replaceState=function(){throw l("history.replaceState not implemented")},e.defineProperty(i,"state",{get:function(){return u}}),t.addEventListener("hashchange",function(){var t=o.hash;s[t]?delete s[t]:(u=a[t]||null,r())})},t.lib={},e.assign(lib,{isTrue:function(t){return!0===t},isFalse:function(t){return!1===t},isHTML:function(t){return t.startsWith("<")&&t.endsWith(">")},isObject:function(t){return e(t)===t},isHTMLElement:function(t){return t instanceof y}}),lib.classExtends=function(t,n){t.prototype=e.create(n.prototype),t.prototype.constructor=t,t.Super=n},lib.array={count:function(t){return r.reduce(t,function(t){return t+1},0)},contains:function(t,n,e){return-1!=r.indexOf(t,n,e)},unique:function(t){for(var n,e=[],r=t.length,i=0,o=0;r>i;)n=t[i],-1==e.indexOf(n)&&(e[o++]=n),i++;return e},all:function(t,n,r){var i=e(t).length;if(!i)return!1;for(;i--;){if(!(i in t))return!1;if(!n.call(r,t[i]))return!1}return!0},refine:function(t){return r.reduce(t,function(t,n){return t.push(n),t},[])},range:function(t,n){var e=[];1 in arguments||(n=t,t=0);for(;n>t;)e.push(t),t++;return e},shuffle:function(t){for(var n,e,i=r.from(t),o=i.length;o--;)n=f.floor(f.random()*(o+1)),e=i[n],i[n]=i[o],i[o]=e;return i},remove:function(t,n){var e=r.indexOf(t,n);return-1!=e&&r.splice(t,e,1)}},lib.date=new function(){var t=this,n=[31,28,31,30,31,30,31,31,30,31,30,31];t.isLeapYear=function(t){return arguments.length||(t=new s),t instanceof s&&(t=t.getFullYear()),t%4==0&&t%100!=0||t%400==0},t.getMonthLength=function(e,r){return arguments.length||(e=new s),e instanceof s&&(r=e.getFullYear(),e=e.getMonth()),1==e&&t.isLeapYear(r)?29:n[e]}},lib.html={parse:function(t){var e=n.createElement("div"),r=n.createDocumentFragment();for(e.innerHTML=t;e.hasChildNodes();)r.appendChild(e.firstChild);return r},escape:function(t){var e=n.createElement("div");return e.appendChild(n.createTextNode(t)),e.innerHTML},unescape:function(t){var e=n.createElement("div");return e.innerHTML=t,e.textContent}},lib.Template=new function(){function t(t){this.template=t}return t.match=function(t,n){return r.isArray(t)&&(t=t.join("")),e.keys(n).reduceRight(function(t,e){var r=n[e];return t.split("{"+e.toUpperCase()+"}").join(r)},t)},t.prototype.match=function(n){return t.match(this.template,n)},t},lib.I18n=new function(){function t(t){this.messageBundle=this[t]}function n(t,n){this.locale=t,this[t]=n}function e(e,r){function i(t,n){return t in i.messageBundle&&(t=i.messageBundle[t]),n?lib.Template.match(t,n):t}return i.add=n,i.use=t,i.add(e,r),i.use(e),i}return e},lib.css=new function(){var i,o=this;o.prefix=i=new function(){var t={},e=["ms","O","Webkit","Moz"],r=new function(){var t=n.documentElement.style,e=t.constructor.prototype;return"top"in e?e:t};return function(n){var i,o,a;if(n in t)return t[n];if(n in r)return t[n]=n,n;for(o=n.charAt(0).toUpperCase()+n.slice(1),a=e.length;a--;)if(i=e[a]+o,i in r)return t[n]=i,i;return void(t[n]=void 0)}},new function(){var t={animation:["Delay","Direction","Duration","FillMode","IterationCount","Name","PlayState","TimingFunction"],transition:["Delay","Duration","Property","TimingFunction"],transform:["Origin","Style"]};e.keys(t).forEach(function(n){var e=i(n);e&&(o[n]=e,t[n].forEach(function(t){o[n+t]=e+t}))})},o.getAnimationNames=new function(){function t(t){return"none"!=t}var n=/,\s*/;return function(e){var r=e[o.animationName];return r?r.split(n).filter(t):[]}},o.set=new function(){function n(t,n){e.keys(n).forEach(function(e){t[i(e)]=n[e]})}return o.transition||o.animation?function(e,r){var i=t.getComputedStyle(e),a=o.getAnimationNames(i);return n(e.style,r),lib.event.awaitTransAnimEnd(e,a)}:function(t,e){return n(t.style,e),Promise.resolve(t)}},o.get=function(n,e){var o=t.getComputedStyle(n);return r.isArray(e)?e.reduce(function(t,n){return t[n]=o[i(n)],t},{}):o[i(e)]},o.getTransitionTime=o.transition?new function(){function t(t){return t.split(",").map(function(t){return a.parseFloat(t)||0})}function n(t,n){for(var e,r=0,i=f.max(n.length,t.length),o=0;i>o;)e=(t[o]||0)+(n[o]||0),e>r&&(r=e),o++;return f.ceil(1e3*r)}return function(e){return n(t(e[o.transitionDelay]),t(e[o.transitionDuration]))}}:function(){return 0}},lib.event=e.assign({preventDefault:function(t){t.preventDefault()},stopPropagation:function(t){t.stopPropagation()}},new function(){function t(t){t.eventTypes.forEach(function(n){t.element.removeEventListener(n,t.callback)})}function n(t,n,e,r){var i;return 3==arguments.length&&(r=e,e=n,n=void 0),n?(n+=","+n+" *",i=function(e){var i=e.target;i.matches&&i.matches(n)&&(r.handleEvent?r.handleEvent(e):r.call(t,e))}):i=r,"string"==typeof e&&(e=e.split(/[\s,]+/)),e.forEach(function(n){t.addEventListener(n,i)}),{element:t,eventTypes:e,callback:i}}function e(e,r,i,o){function a(n){t(u),o.handleEvent?o.handleEvent(n):o.call(e,n)}var u;3==arguments.length&&(o=i,i=r,r=void 0),u=n(e,r,i,a)}function r(t,n,r){return 2==arguments.length&&(r=n,n=void 0),new Promise(function(i){e(t,n,r,i)})}return{off:t,on:n,one:e,when:r}},new function(){function n(t,n){return t?n.reduce(function(n,e){return-1==t.indexOf(e)&&n.push(e),n},[]):n}function e(t,n){var e=t.indexOf(n);return-1!=e&&t.splice(e,1),t.length}function r(t,n){return n||(n=a.getAnimationNames(t)),n.length?new Promise(function(r){function i(o){o.target!=t||e(n,o.animationName)||(t.removeEventListener(c,i),r(t))}t.addEventListener(c,i)}):Promise.resolve(t)}function i(n,e){var r;return e||(e=t.getComputedStyle(n)),r=a.getTransitionTime(e),r?new Promise(function(e){t.setTimeout(function(){e(n)},r)}):Promise.resolve(n)}function o(e,o){var u=t.getComputedStyle(e),s=a.getAnimationNames(u);return s=n(o,s),Promise.all([r(e,s),i(e,u)]).then(function(){return e})}var a=lib.css,u=a.animation,s=a.transition,c={animation:"animationend",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"}[u],f=Promise.resolve;return{animationEnd:c,animationStart:{animation:"animationstart",MozAnimation:"mozAnimationStart",WebkitAnimation:"webkitAnimationStart"}[u],animationIteration:{animation:"animationiteration",MozAnimation:"mozAnimationIteration",WebkitAnimation:"webkitAnimationIteration"}[u],transitionEnd:{transition:"transitionend",MozTransition:"mozTransitionEnd",WebkitTransition:"webkitTransitionEnd"}[s],awaitAnimationEnd:u?r:f,awaitTransitionEnd:s?i:f,awaitTransAnimEnd:u||s?o:f}}),lib.dom=e.assign({ready:function(){return"complete"==n.readyState?Promise.resolve():lib.event.when(n,"DOMContentLoaded")}},new function(){function n(t,n,e){var r=t.className,i=t.classList;return e.forEach(function(t){i[n](t)}),r!=t.className}function e(t,n){return o(n[0],t,r.slice(n,1))}var i=lib.css,o=i.animation||i.transition?function(e,r,o){var a=t.getComputedStyle(e),u=i.getAnimationNames(a);
return n(e,r,o)?lib.event.awaitTransAnimEnd(e,u):Promise.resolve(e)}:function(t,e,r){return n(t,e,r),Promise.resolve(t)};return{addClass:function(){return e("add",arguments)},removeClass:function(){return e("remove",arguments)},toggleClass:function(){return e("toggle",arguments)}}}),lib.request=new function(){function r(t,n){return encodeURIComponent(t)+"="+encodeURIComponent(n)}function i(t){return e.keys(t).reduce(function(n,e){return n.push(r(e,t[e])),n},[]).join("&")}function o(t){t.onload=null,t.onerror=null,t.ontimeout=null}function a(n){var r=(n.method||"GET").toUpperCase(),a=n.url||t.location.href,s=n.data,c=n.userName||"",f=n.password||"",h=n.timeout||0,p=!1!==n.async,d=!1!==n.caching,m=!0===n.credentials,g=n.mimeType,v={"X-Requested-With":"XMLHttpRequest"};return e(s)===s&&(s instanceof FormData?v["Content-Type"]="multipart/form-data":s=i(s)),"POST"==r?v["Content-Type"]=v["Content-Type"]||"application/x-www-form-urlencoded; charset=UTF-8":(d||(a+="?no-cache="+u()),"string"==typeof s&&(a+=(d?"?":"&")+s),s=null),n.headers&&e.assign(v,n.headers),new Promise(function(t,n){function i(){o(this),this.status>=200&&this.status<400?t(this):n(new l(this.statusText))}function u(){o(this),n(new l(this.statusText))}function d(){o(this),n(new l("time is out"))}!new function(){var t=new XMLHttpRequest;t.open(r,a,p,c,f),m&&(t.withCredentials=!0),g&&t.overrideMimeType(g),e.keys(v).forEach(function(n){t.setRequestHeader(n,v[n])}),t.onload=i,t.onerror=u,h&&(t.timeout=h,t.ontimeout=d),t.send(s)}})}var u=new function(){var t={};return function(){var n=f.random().toString().slice(2);return t[n]?u():(t[n]=1,n)}};return e.assign(a,{toQueryParam:r,toQueryString:i,get:function(t){return"string"==typeof t&&(t={url:t}),t.method="GET",a(t)},post:function(t){return t.method="POST",a(t)},json:function(t){return a.get(t).then(function(t){return JSON.parse(t.responseText)})},jsonp:function(t){return a.script(t)},script:function(r){var a,s,c;return"string"==typeof r&&(r={url:r}),a=r.url||t.location.href,s=r.data,c=r.caching!==!1,e(s)===s&&(s=i(s)),c||(a+="?no-cache="+u()),"string"==typeof s&&(a+=(c?"?":"&")+s),new Promise(function(t,r){n.head.appendChild(e.assign(n.createElement("script"),{onload:function(){o(this),this.remove(),t()},onerror:function(){o(this),this.remove(),r(new l("Could not load script"))},async:!0,defer:!0,src:a}))})}}),a}}(window,document,Object,Array,Function,String,Number,Boolean,Date,RegExp,Math,Error,TypeError,isFinite,isNaN,parseFloat,parseInt);