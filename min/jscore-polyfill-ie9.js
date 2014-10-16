//jsCore polyfill v0.6.1 IE9+ github.com/Octane/jsCore
!function(t,e,n,i,r,o,s,u,a,c,f,h,l,p,d,m,g){"use strict";function y(){}(function(){var t=n.create({});return t[0]=null,t.hasOwnProperty(0)})()||new function(){var t=n.create;n.create=function(e,i){var r=t(e,i);return n.hasOwnProperty.call(r,0)||(n.defineProperty(r,0,{configurable:!0}),delete r[0]),r}},n.assign||(n.assign=function(t){return i.prototype.slice.call(arguments,1).forEach(function(e){e&&n.keys(e).forEach(function(n){t[n]=e[n]})}),t}),n.is||(n.is=function(t,e){return 0===t&&0===e?1/t===1/e:t!==t?e!==e:t===e}),n.setPrototypeOf||(n.setPrototypeOf=function(t,e){return t.__proto__=e,t}),i.from||(i.from=function(t,e,n){return e?i.map(t,e,n):i.slice(t,0)}),i.of||(i.of=function(){return i.from(arguments)}),i.prototype.find||(i.prototype.find=function(t,e){for(var n,i=this.length,r=0;i>r;){if(n=this[r],t.call(e,n,r,this))return n;r++}return void 0}),i.prototype.findIndex||(i.prototype.findIndex=function(t,e){for(var n,i=this.length,r=0;i>r;){if(n=this[r],t.call(e,n,r,this))return r;r++}return-1}),i.prototype.fill||(i.prototype.fill=function(t,e,n){var i,r=this.length;e=s(e)||0,n=2 in arguments?s(n)||0:r,i=0>e?f.max(r+e,0):f.min(e,r),n=0>n?f.max(r+n,0):f.min(n,r);for(;n>i;)this[i]=t,i++;return this}),i.prototype.contains||(i.prototype.contains=function(t,e){var n,i=this.length;if(!i)return!1;if(s.isNaN(t)){1 in arguments?(e=s(e)||0,n=0>e?f.max(i+e,0):e):n=0;for(;i>n;){if(n in this&&s.isNaN(this[n]))return!0;n++}return!1}return-1!=this.indexOf(t,e)}),o.prototype.startsWith||(o.prototype.startsWith=function(t,e){return e||(e=0),this.indexOf(t,e)==e}),o.prototype.endsWith||(o.prototype.endsWith=function(t,e){var n;return e=e||this.length,e-=t.length,n=this.lastIndexOf(t),-1!=n&&n==e}),o.prototype.contains||(o.prototype.contains=function(t,e){return-1!=this.indexOf(t,e||0)}),o.prototype.repeat||(o.prototype.repeat=function(t){return new i(t+1).join(this)}),s.isFinite||(s.isFinite=function(t){return"number"==typeof t&&p(t)}),s.isInteger||(s.isInteger=function(t){return"number"==typeof t&&p(t)&&t>-9007199254740992&&9007199254740992>t&&f.floor(t)==t}),s.isNaN||(s.isNaN=function(t){return"number"==typeof t&&d(t)}),s.parseInt||(s.parseInt=g),s.parseFloat||(s.parseFloat=m),f.trunc||(f.trunc=function(t){return t=s(t),d(t)||0===t||!s.isFinite(t)?t:f.sign(t)*f.floor(f.abs(t))}),f.sign||(f.sign=function(t){return 0===t||d(t)?t:(t>0)-(0>t)}),new function(){function t(t,e){var n=e[0];switch(e.length){case 1:return t.call(n);case 2:return t.call(n,e[1]);case 3:return t.call(n,e[1],e[2])}return t.apply(n,i.prototype.slice.call(e,1))}function e(e){return function(){return t(e,arguments)}}function r(t,n){return n.reduce(function(n,i){return n[i]=e(t[i]),n},{})}function s(t,e){n.keys(e).forEach(function(n){n in t||(t[n]=e[n])})}s(i,r(i.prototype,["concat","every","fill","filter","find","findIndex","forEach","indexOf","join","lastIndexOf","map","pop","push","reduce","reduceRight","reverse","shift","slice","some","sort","splice","unshift","contains"])),s(o,r(o.prototype,["charAt","charCodeAt","concat","contains","endsWith","indexOf","lastIndexOf","match","repeat","replace","search","slice","split","startsWith","substr","substring","toLowerCase","toUpperCase","trim"]))},t.Set||(t.Set=new function(){function t(){if(arguments.length)throw h("Set implementation doesn't accept parameters");this.length=0}return n.assign(t.prototype,{size:0,add:function(t){this.has(t)||(this.size=i.push(this,t))},has:function(t){return-1!=i.findIndex(this,function(e){return n.is(t,e)})},"delete":function(t){var e=i.findIndex(this,function(e){return n.is(t,e)});return-1==e?!1:(i.splice(this,e,1),this.size--,!0)},clear:function(){i.splice(this,0,this.length),this.size=0}}),t}),t.Map||(t.Map=new function(){function t(){if(arguments.length)throw h("Map implementation doesn't accept parameters");this.length=0}var e=0,r=1;return n.assign(t.prototype,{size:0,_getPair:function(t){return i.find(this,function(i){return n.is(t,i[e])})},set:function(t,e){var n=this._getPair(t);n?n[r]=e:this.size=i.push(this,[t,e])},get:function(t){return n(this._getPair(t))[r]},has:function(t){return u(this._getPair(t))},"delete":function(t){var r=i.findIndex(this,function(i){return n.is(t,i[e])});return-1==r?!1:(i.splice(this,r,1),this.size--,!0)},clear:function(){i.splice(this,0,this.length),this.size=0}}),t}),t.WeakSet||(t.WeakSet=new function(){function t(){if(arguments.length)throw h("WeakSet implementation doesn't accept parameters");this.length=0}function e(t){return this===t}function r(t){if(n(t)!==t)throw l("Invalid value used in weak set");return t}return n.assign(t.prototype,{add:function(t){this.has(r(t))||i.push(this,t)},has:function(t){return-1!=i.findIndex(this,e,r(t))},"delete":function(t){var n=i.findIndex(this,e,r(t));return-1==n?!1:(i.splice(this,n,1),!0)},clear:function(){i.splice(this,0,this.length)}}),t}),t.WeakMap||(t.WeakMap=new function(){function t(){if(arguments.length)throw h("WeakMap implementation doesn't accept parameters");this.length=0}function e(t){return this===t[o]}function r(t){if(n(t)!==t)throw l("Invalid value used as weak map key");return t}var o=0,s=1;return n.assign(t.prototype,{_getPair:function(t){return i.find(this,e,r(t))},set:function(t,e){var n=this._getPair(t);n?n[s]=e:i.push(this,[t,e])},get:function(t){return n(this._getPair(t))[s]},has:function(t){return u(this._getPair(t))},"delete":function(t){var n=i.findIndex(this,e,r(t));return-1==n?!1:(i.splice(this,n,1),!0)},clear:function(){i.splice(this,0,this.length)}}),t}),t.setImmediate||n.assign(t,new function(){function e(e){var n=e[0];switch(e.length){case 1:return n();case 2:return n(e[1]);case 3:return n(e[1],e[2])}return n.apply(t,i.prototype.slice.call(e,1))}function n(t){var n,i=t.data;"string"==typeof i&&i.startsWith(u)&&(n=o[i],n&&(delete o[i],e(n)))}var r=0,o={},s=!0,u="setImmediatePolyfillMessage";return{setImmediate:function(){var e=r++,i=u+e;return o[i]=arguments,s&&(s=!1,t.addEventListener("message",n)),t.postMessage(i,"*"),e},clearImmediate:function(t){delete o[u+t]}}}),t.Promise||(t.Promise=new function(){function e(e){return r(e)?e:new h(function(n,i){t.setImmediate(function(){try{e.then(n,i)}catch(t){i(t)}})})}function i(t){return"function"==typeof t}function r(t){return t instanceof h}function o(t){return n(t)===t&&i(t.then)}function s(t){return t._fulfilled||t._rejected}function u(t){return t}function a(t){throw t}function c(t){t()}function f(t,n,i){function r(t){o(t)?e(t).then(r,s):n(t)}function s(t){o(t)?e(t).then(r,s):i(t)}e(t).then(r,s)}function h(t){n.assign(this,{_fulfilled:!1,_rejected:!1,_value:void 0,_reason:void 0,_onFulfilled:[],_onRejected:[]}),this._resolve(t)}return n.assign(h,{resolve:function(t){return o(t)?e(t):new h(function(e){e(t)})},reject:function(t){return new h(function(e,n){n(t)})},race:function(t){return new h(function(e,n){for(var i,r=t.length,s=0;r>s;)i=t[s],o(i)?f(i,e,n):e(i),s++})},all:function(t){return new h(function(e,n){var i,r=0,s=0,u=t.length,a=0;for(t=t.slice(0);u>a;)i=t[a],o(i)?(r++,f(i,function(n){return function(i){t[n]=i,s++,s==r&&e(t)}}(a),n)):t[a]=i,a++;r||e(t)})}}),n.assign(h.prototype,{_resolve:function(t){function e(t){i._fulfill(t)}function n(t){i._reject(t)}var i=this;try{t(e,n)}catch(r){s(i)||n(r)}},_fulfill:function(t){s(this)||(this._fulfilled=!0,this._value=t,this._onFulfilled.forEach(c),this._clearQueue())},_reject:function(t){s(this)||(this._rejected=!0,this._reason=t,this._onRejected.forEach(c),this._clearQueue())},_enqueue:function(t,e){this._onFulfilled.push(t),this._onRejected.push(e)},_clearQueue:function(){this._onFulfilled=[],this._onRejected=[]},then:function(n,r){var s=this;return n=i(n)?n:u,r=i(r)?r:a,new h(function(i,u){function a(){t.setImmediate(function(){var t;try{t=n(s._value)}catch(r){return void u(r)}o(t)?e(t).then(i,u):i(t)})}function c(){t.setImmediate(function(){var t;try{t=r(s._reason)}catch(n){return void u(n)}o(t)?e(t).then(i,u):i(t)})}n=n||defaultOnFulfilled,r=r||defaultOnRejected,s._fulfilled?a():s._rejected?c():s._enqueue(a,c)})},"catch":function(t){return this.then(void 0,t)}}),h}),t.requestAnimationFrame||n.assign(t,{requestAnimationFrame:[t.msRequestAnimationFrame,t.mozRequestAnimationFrame,t.webkitRequestAnimationFrame,new function(){var e=60,n=1e3/e,i=a.now(),r=i;return function(e){var o=a.now(),s=f.max(0,n-(o-r)),u=o+s;return r=u,t.setTimeout(function(){e(u-i)},s)}}].find(u),cancelAnimationFrame:[t.mozCancelAnimationFrame,t.webkitCancelAnimationFrame,t.cancelRequestAnimationFrame,t.msCancelRequestAnimationFrame,t.mozCancelRequestAnimationFrame,t.webkitCancelRequestAnimationFrame,t.clearTimeout].find(u)}),"dataset"in e.documentElement||n.defineProperty(HTMLElement.prototype,"dataset",{get:new function(){function t(t){return t.charAt(1).toUpperCase()}function e(e){return e.substr(5).replace(/-./g,t)}function r(t){return{get:function(){return t.value},set:function(e){t.value=o(e)}}}function s(t,o){return i.forEach(o,function(i){var o=i.name.toLowerCase();o.startsWith("data-")&&n.defineProperty(t,e(o),r(i))}),t}return function(){return s(new y,this.attributes)}}}),"children"in e.createDocumentFragment()||new function(){function t(t){t in i||n.defineProperty(i,t,{get:o[t]})}var i,r=1,o={firstElementChild:function(){for(var t=this.firstChild;t&&r!=t.nodeType;)t=t.nextSibling;return t},lastElementChild:function(){for(var t=this.lastChild;t&&r!=t.nodeType;)t=t.previousSibling;return t},nextElementSibling:function(){var t=this;do t=t.nextSibling;while(t&&r!=t.nodeType);return t},previousElementSibling:function(){var t=this;do t=t.previousSibling;while(t&&r!=t.nodeType);return t},childElementCount:function(){return this.children.length},children:new function(){function t(){}return t.prototype.item=function(t){return this[t]||null},function(){for(var e,n=new t,i=this.childNodes,o=i.length,s=0,u=0;o>s;)e=i[s],r==e.nodeType&&(n[u++]=e),s++;return n.length=u,n}}};i=HTMLElement.prototype,n.keys(o).forEach(t),[e.constructor,e.createDocumentFragment().constructor].forEach(function(e){i=e.prototype,["firstElementChild","lastElementChild","childElementCount","children"].forEach(t)})},"append"in e.createDocumentFragment()||new function(){function t(t,e,n){return-1!=i.indexOf(t.querySelectorAll(n),e)}function r(t){var n,r,o,s=t.length;if(1==s)return n=t[0],"string"==typeof n?e.createTextNode(n):n;for(r=e.createDocumentFragment(),t=i.from(t),o=0;s>o;)n=t[o],"string"==typeof n&&(n=e.createTextNode(n)),r.appendChild(n),o++;return r}function o(t){t in a||(a[t]=c[t])}var s=1,a=HTMLElement.prototype,c={before:function(){var t=this.parentNode;t&&t.insertBefore(r(arguments),this)},after:function(){var t,e,n=this.parentNode;n&&(e=r(arguments),t=this.nextSibling,t?n.insertBefore(e,t):n.appendChild(e))},replace:function(){var t=this.parentNode;t&&t.replaceChild(r(arguments),this)},remove:function(){var t=this.parentNode;t&&t.removeChild(this)},append:function(){this.appendChild(r(arguments))},prepend:function(){this.insertBefore(r(arguments),this.firstChild)},querySelector:a.querySelector,querySelectorAll:a.querySelectorAll,matches:[a.matchesSelector,a.oMatchesSelector,a.msMatchesSelector,a.mozMatchesSelector,a.webkitMatchesSelector,function(n){var i,r;return this===e?!1:(r=this.parentNode)?(s==r.nodeType&&(r=r.ownerDocument),t(r,this,n)):(r=e.createDocumentFragment(),r.appendChild(this),i=t(r,this,n),void r.removeChild(this))}].find(u)};n.keys(c).forEach(o),a=e.constructor.prototype,["querySelector","querySelectorAll"].forEach(o),a=e.createDocumentFragment().constructor.prototype,["append","prepend","querySelector","querySelectorAll","matches"].forEach(o)},"classList"in e.documentElement||n.defineProperty(HTMLElement.prototype,"classList",{get:new function(){function t(t,e){this._getTokens=t,this._onChange=e}function e(t){return t=t.trim(),t?t.split(/\s\s*/):[]}return n.assign(t.prototype,{_clear:function(){i.splice(this,0,this.length)},_push:function(t){i.prototype.push.apply(this,t)},_update:function(){this._clear(),this._push(this._getTokens())},item:function(t){return this._update(),this[t]||null},add:function(){var t;this._update(),t=this.length,i.forEach(arguments,function(t){-1==i.indexOf(this,t)&&i.push(this,t)},this),t!=this.length&&this._onChange()},remove:function(){var t;this._update(),t=this.length,i.forEach(arguments,function(t){var e=i.indexOf(this,t);-1!=e&&i.splice(this,e,1)},this),t!=this.length&&this._onChange()},toggle:function(t,e){return this._update(),e===!1||this.contains(t)?(this.remove(t),!1):(this.add(t),!0)},contains:function(t){return this._update(),-1!=i.indexOf(this,t)},toString:function(){return i.join(this," ")}}),function(){var n=this;return n._classList||(n._classList=new t(function(){return e(n.className)},function(){n.className=this.toString()})),n._classList._update(),n._classList}}}),t.FormData||(t.FormData=new function(){function t(t){this.boundary=e(),t&&i.prototype.push.apply(this,r(t))}var e=new function(){function t(){var n=f.random().toString().slice(2);return e[n]?t():(e[n]=1,n)}var e={};return function(){return"-------------------------"+t()}},r=new function(){function t(t){return t.selected}function e(e){var n=e.nodeName.toLowerCase(),r=e.type;return e.name?e.disabled?!1:"fieldset"==n?!1:"select"==n&&e.multiple?i.some(e.options,t):"submit"==r||"reset"==r||"button"==r||"file"==r?!1:"radio"!=r&&"checkbox"!=r||!e.checked?!0:!1:!1}function n(e){return"select"==e.tagName.toLowerCase()&&e.multiple?i.reduce(e.options,function(e,n){return t(n)&&e.push(n.value),e},[]):[e.value]}return function(t){return i.reduce(t.elements,function(t,i){return e(i)&&n(i).forEach(function(e){t.push({name:i.name,value:e})}),t},[])}};return n.assign(t.prototype,{notNative:!0,append:function(t,e,n){i.push(this,{name:t,value:e,fileName:n})},toString:function(){var t=this.boundary,e="";return i.forEach(this,function(i){var r,o=i.name,s=i.value;e+="--"+t+"\r\n",n(s)===s?(r=i.fileName||s.name,e+='Content-Disposition: form-data; name="',e+=o+'"; filename="'+r+'"\r\n',e+="Content-Type: "+s.type+"\r\n\r\n",e+=s.content+"\r\n"):(e+='Content-Disposition: form-data; name="',e+=o+'"\r\n\r\n',e+=s+"\r\n")}),e+="--"+t+"--"}}),XMLHttpRequest.prototype.send=new function(){var e=XMLHttpRequest.prototype.send;return function(n){n instanceof t&&(this.setRequestHeader("Content-Type","multipart/form-data; boundary="+n.boundary),n=n.toString()),e.call(this,n)}},t}),history.pushState||new function(){}}(window,document,Object,Array,Function,String,Number,Boolean,Date,RegExp,Math,Error,TypeError,isFinite,isNaN,parseFloat,parseInt);