//jsCore v0.4.8 IE10+ github.com/Octane/jsCore
!function(n,t,e,r,i,o,a,u,s,c,f,l,h,m,p,d,g){"use strict";function v(){}(function(){var n=e.create({});return n[0]=null,n.hasOwnProperty(0)})()||new function(){var n=e.create;e.create=function(t,r){var i=n(t,r);return e.hasOwnProperty.call(i,0)||(e.defineProperty(i,0,{configurable:!0}),delete i[0]),i}},e.assign||(e.assign=function(n){return r.prototype.slice.call(arguments,1).forEach(function(t){e.keys(t).forEach(function(e){n[e]=t[e]})}),n}),e.is||(e.is=function(n,t){return 0===n&&0===t?1/n===1/t:n!==n?t!==t:n===t}),e.setPrototypeOf||(e.setPrototypeOf=function(n,t){return n.__proto__=t,n}),r.from||(r.from=function(n,t,i){return e(n).length?t?r.map(n,t,i):r.slice(n,0):[]}),r.of||(r.of=function(){return r.from(arguments)}),r.prototype.find||(r.prototype.find=function(n,t){for(var e,r=this.length,i=0;r>i;){if(i in this&&(e=this[i],n.call(t,e,i,this)))return e;i++}return void 0}),r.prototype.findIndex||(r.prototype.findIndex=function(n,t){for(var e,r=this.length,i=0;r>i;){if(i in this&&(e=this[i],n.call(t,e,i,this)))return i;i++}return-1}),r.prototype.fill||(r.prototype.fill=function(n,t,e){var r,i=this.length;t=a(t)||0,e=2 in arguments?a(e)||0:i,r=0>t?f.max(i+t,0):f.min(t,i),e=0>e?f.max(i+e,0):f.min(e,i);for(;e>r;)this[r]=n,r++;return this}),o.prototype.startsWith||(o.prototype.startsWith=function(n,t){return t||(t=0),this.indexOf(n,t)==t}),o.prototype.endsWith||(o.prototype.endsWith=function(n,t){var e;return t=t||this.length,t-=n.length,e=this.lastIndexOf(n),-1!=e&&e==t}),o.prototype.contains||(o.prototype.contains=function(n,t){return-1!=this.indexOf(n,t||0)}),o.prototype.repeat||(o.prototype.repeat=function(n){return new r(n+1).join(this)}),a.isFinite||(a.isFinite=function(n){return"number"==typeof n&&m(n)}),a.isInteger||(a.isInteger=function(n){return"number"==typeof n&&m(n)&&n>-9007199254740992&&9007199254740992>n&&f.floor(n)==n}),a.isNaN||(a.isNaN=function(n){return"number"==typeof n&&p(n)}),a.parseInt||(a.parseInt=g),a.parseFloat||(a.parseFloat=d),f.trunc||(f.trunc=function(n){return n=a(n),p(n)||0===n||!a.isFinite(n)?n:f.sign(n)*f.floor(f.abs(n))}),f.sign||(f.sign=function(n){return 0===n||p(n)?n:(n>0)-(0>n)}),new function(){function n(n,t){var e=t[0];switch(t.length){case 1:return n.call(e);case 2:return n.call(e,t[1]);case 3:return n.call(e,t[1],t[2])}return n.apply(e,r.prototype.slice.call(t,1))}function t(t){return function(){return n(t,arguments)}}function i(n,e){return e.reduce(function(e,r){return e[r]=t(n[r]),e},{})}function a(n,t){e.keys(t).forEach(function(e){e in n||(n[e]=t[e])})}a(r,i(r.prototype,["concat","every","fill","filter","find","findIndex","forEach","indexOf","join","lastIndexOf","map","pop","push","reduce","reduceRight","reverse","shift","slice","some","sort","splice","unshift"])),a(o,i(o.prototype,["charAt","charCodeAt","concat","contains","endsWith","indexOf","lastIndexOf","match","repeat","replace","search","slice","split","startsWith","substr","substring","toLowerCase","toUpperCase","trim"]))},n.Set||(n.Set=new function(){function n(){if(arguments.length)throw l("Set implementation doesn't accept parameters");this.length=0}return e.assign(n.prototype,{size:0,add:function(n){this.has(n)||(this.size=r.push(this,n))},has:function(n){return-1!=r.findIndex(this,function(t){return e.is(n,t)})},"delete":function(n){var t=r.findIndex(this,function(t){return e.is(n,t)});return-1==t?!1:(r.splice(this,t,1),this.size--,!0)},clear:function(){r.splice(this,0,this.length),this.size=0}}),n}),n.Map||(n.Map=new function(){function n(){if(arguments.length)throw l("Map implementation doesn't accept parameters");this.length=0}var t=0,i=1;return e.assign(n.prototype,{size:0,_getPair:function(n){return r.find(this,function(r){return e.is(n,r[t])})},set:function(n,t){var e=this._getPair(n);e?e[i]=t:this.size=r.push(this,[n,t])},get:function(n){return e(this._getPair(n))[i]},has:function(n){return u(this._getPair(n))},"delete":function(n){var i=r.findIndex(this,function(r){return e.is(n,r[t])});return-1==i?!1:(r.splice(this,i,1),this.size--,!0)},clear:function(){r.splice(this,0,this.length),this.size=0}}),n}),n.WeakSet||(n.WeakSet=new function(){function n(){if(arguments.length)throw l("WeakSet implementation doesn't accept parameters");this.length=0}function t(n){return this===n}function i(n){if(e(n)!==n)throw h("Invalid value used in weak set");return n}return e.assign(n.prototype,{add:function(n){this.has(i(n))||r.push(this,n)},has:function(n){return-1!=r.findIndex(this,t,i(n))},"delete":function(n){var e=r.findIndex(this,t,i(n));return-1==e?!1:(r.splice(this,e,1),!0)},clear:function(){r.splice(this,0,this.length)}}),n}),n.WeakMap||(n.WeakMap=new function(){function n(){if(arguments.length)throw l("WeakMap implementation doesn't accept parameters");this.length=0}function t(n){return this===n[o]}function i(n){if(e(n)!==n)throw h("Invalid value used as weak map key");return n}var o=0,a=1;return e.assign(n.prototype,{_getPair:function(n){return r.find(this,t,i(n))},set:function(n,t){var e=this._getPair(n);e?e[a]=t:r.push(this,[n,t])},get:function(n){return e(this._getPair(n))[a]},has:function(n){return u(this._getPair(n))},"delete":function(n){var e=r.findIndex(this,t,i(n));return-1==e?!1:(r.splice(this,e,1),!0)},clear:function(){r.splice(this,0,this.length)}}),n}),n.setImmediate||e.assign(n,new function(){function t(t){var e=t[0];switch(t.length){case 1:return e();case 2:return e(t[1]);case 3:return e(t[1],t[2])}return e.apply(n,r.prototype.slice.call(t,1))}function e(n){var e,r=n.data;"string"==typeof r&&r.startsWith(u)&&(e=o[r],e&&(delete o[r],t(e)))}var i=0,o={},a=!0,u="setImmediatePolyfillMessage";return{setImmediate:function(){var t=i++,r=u+t;return o[r]=arguments,a&&(a=!1,n.addEventListener("message",e)),n.postMessage(r,"*"),t},clearImmediate:function(n){delete o[u+n]}}}),n.Promise||(n.Promise=new function(){function t(t){return r(t)?t:new f(function(e,r){n.setImmediate(function(){try{t.then(e,r)}catch(n){r(n)}})})}function r(n){return n instanceof f}function i(n){return e(n)===n&&"function"==typeof n.then}function o(n){return n._fulfilled||n._rejected}function a(n){return n.every(o)}function u(n){return n}function s(n){throw n}function c(n){n()}function f(n){e.assign(this,{_fulfilled:!1,_rejected:!1,_value:void 0,_reason:void 0,_onFulfilled:[],_onRejected:[]}),this._resolve(n)}return e.assign(f,{resolve:function(n){return i(n)?t(n):new f(function(t){t(n)})},reject:function(n){return new f(function(t,e){e(n)})},race:function(n){return new f(function(e,r){n.forEach(function(n){t(n).then(e,r)})})},all:function(n){return new f(function(e,r){var i=[];n=n.map(t),n.forEach(function(t,o){t.then(function(t){i[o]=t,a(n)&&e(i)},r)})})}}),e.assign(f.prototype,{_resolve:function(n){function t(n){r._fulfill(n)}function e(n){r._reject(n)}var r=this;try{n(t,e)}catch(i){o(r)||e(i)}},_fulfill:function(n){o(this)||(this._fulfilled=!0,this._value=n,this._onFulfilled.forEach(c),this._clearQueue())},_reject:function(n){o(this)||(this._rejected=!0,this._reason=n,this._onRejected.forEach(c),this._clearQueue())},_enqueue:function(n,t){this._onFulfilled.push(n),this._onRejected.push(t)},_clearQueue:function(){this._onFulfilled=[],this._onRejected=[]},then:function(e,r){var o=this;return new f(function(a,c){function f(){n.setImmediate(function(){var n;try{n=e(o._value)}catch(r){return void c(r)}i(n)?t(n).then(a,c):a(n)})}function l(){n.setImmediate(function(){var n;try{n=r(o._reason)}catch(e){return void c(e)}i(n)?t(n).then(a,c):a(n)})}e=e||u,r=r||s,o._fulfilled?f():o._rejected?l():o._enqueue(f,l)})},"catch":function(n){return this.then(void 0,n)}}),f}),n.requestAnimationFrame||e.assign(n,{requestAnimationFrame:[n.msRequestAnimationFrame,n.mozRequestAnimationFrame,n.webkitRequestAnimationFrame,new function(){var t=60,e=1e3/t,r=s.now(),i=r;return function(t){var o=s.now(),a=f.max(0,e-(o-i)),u=o+a;return i=u,n.setTimeout(function(){t(u-r)},a)}}].find(u),cancelAnimationFrame:[n.mozCancelAnimationFrame,n.webkitCancelAnimationFrame,n.cancelRequestAnimationFrame,n.msCancelRequestAnimationFrame,n.mozCancelRequestAnimationFrame,n.webkitCancelRequestAnimationFrame,n.clearTimeout].find(u)}),"dataset"in t.documentElement||e.defineProperty(HTMLElement.prototype,"dataset",{get:new function(){function n(n){return n.charAt(1).toUpperCase()}function t(t){return t.substr(5).replace(/-./g,n)}function i(n){return{get:function(){return n.value},set:function(t){n.value=o(t)}}}function a(n,o){return r.forEach(o,function(r){var o=r.name.toLowerCase();o.startsWith("data-")&&e.defineProperty(n,t(o),i(r))}),n}return function(){return a(new v,this.attributes)}}}),"children"in t.createDocumentFragment()||new function(){function n(n){n in r||e.defineProperty(r,n,{get:o[n]})}var r,i=1,o={firstElementChild:function(){for(var n=this.firstChild;n&&i!=n.nodeType;)n=n.nextSibling;return n},lastElementChild:function(){for(var n=this.lastChild;n&&i!=n.nodeType;)n=n.previousSibling;return n},nextElementSibling:function(){var n=this;do n=n.nextSibling;while(n&&i!=n.nodeType);return n},previousElementSibling:function(){var n=this;do n=n.previousSibling;while(n&&i!=n.nodeType);return n},childElementCount:function(){return this.children.length},children:new function(){function n(){}return n.prototype.item=function(n){return this[n]||null},function(){for(var t,e=new n,r=this.childNodes,o=r.length,a=0,u=0;o>a;)t=r[a],i==t.nodeType&&(e[u++]=t),a++;return e.length=u,e}}};r=HTMLElement.prototype,e.keys(o).forEach(n),[t.constructor,t.createDocumentFragment().constructor].forEach(function(t){r=t.prototype,["firstElementChild","lastElementChild","childElementCount","children"].forEach(n)})},"append"in t.createDocumentFragment()||new function(){function n(n,t,e){return-1!=r.indexOf(n.querySelectorAll(e),t)}function i(n){var e,i,o,a=n.length;if(1==a)return e=n[0],"string"==typeof e?t.createTextNode(e):e;for(i=t.createDocumentFragment(),n=r.from(n),o=0;a>o;)e=n[o],"string"==typeof e&&(e=t.createTextNode(e)),i.appendChild(e),o++;return i}function o(n){n in s||(s[n]=c[n])}var a=1,s=HTMLElement.prototype,c={before:function(){var n=this.parentNode;n&&n.insertBefore(i(arguments),this)},after:function(){var n,t,e=this.parentNode;e&&(t=i(arguments),n=this.nextSibling,n?e.insertBefore(t,n):e.appendChild(t))},replace:function(){var n=this.parentNode;n&&n.replaceChild(i(arguments),this)},remove:function(){var n=this.parentNode;n&&n.removeChild(this)},append:function(){this.appendChild(i(arguments))},prepend:function(){this.insertBefore(i(arguments),this.firstChild)},query:function(n){return this.querySelector(n)},queryAll:function(n){return this.querySelectorAll(n)},matches:[s.matchesSelector,s.oMatchesSelector,s.msMatchesSelector,s.mozMatchesSelector,s.webkitMatchesSelector,function(e){var r,i;return this===t?!1:(i=this.parentNode)?(a==i.nodeType&&(i=i.ownerDocument),n(i,this,e)):(i=t.createDocumentFragment(),i.appendChild(this),r=n(i,this,e),void i.removeChild(this))}].find(u)};e.keys(c).forEach(o),s=t.constructor.prototype,["query","queryAll"].forEach(o),s=t.createDocumentFragment().constructor.prototype,["append","prepend","query","queryAll","matches"].forEach(o)},n.lib={},lib.classExtends=function(n,t){n.prototype=e.create(t.prototype),n.prototype.constructor=n,n.Super=t},lib.array={count:function(n){return r.reduce(n,function(n){return n+1},0)},contains:function(n,t,e){return-1!=r.indexOf(n,t,e)},unique:function(n){for(var t,e=[],r=n.length,i=0,o=0;r>i;)t=n[i],-1==e.indexOf(t)&&(e[o++]=t),i++;return e},all:function(n,t,r){var i=e(n).length;if(!i)return!1;for(;i--;){if(!(i in n))return!1;if(!t.call(r,n[i]))return!1}return!0},refine:function(n){return r.reduce(n,function(n,t){return n.push(t),n},[])},range:function(n,t){var e=[];1 in arguments||(t=n,n=0);for(;t>n;)e.push(n),n++;return e},shuffle:function(n){for(var t,e,i=r.from(n),o=i.length;o--;)t=f.floor(f.random()*(o+1)),e=i[t],i[t]=i[o],i[o]=e;return i},remove:function(n,t){var e=r.indexOf(n,t);return-1!=e&&r.splice(n,e,1)}},lib.date=new function(){var n=this,t=[31,28,31,30,31,30,31,31,30,31,30,31];n.isLeapYear=function(n){return arguments.length||(n=new s),n instanceof s&&(n=n.getFullYear()),n%4==0&&n%100!=0||n%400==0},n.getMonthLength=function(e,r){return arguments.length||(e=new s),e instanceof s&&(r=e.getFullYear(),e=e.getMonth()),1==e&&n.isLeapYear(r)?29:t[e]}},lib.html={parse:function(n){var e=t.createElement("div"),r=t.createDocumentFragment();for(e.innerHTML=n;e.hasChildNodes();)r.appendChild(e.firstChild);return r},escape:function(n){var e=t.createElement("div");return e.appendChild(t.createTextNode(n)),e.innerHTML},unescape:function(n){var e=t.createElement("div");return e.innerHTML=n,e.textContent}},lib.Template=new function(){function n(n){this.template=n}return n.match=function(n,t){return r.isArray(n)&&(n=n.join("")),e.keys(t).reduceRight(function(n,e){var r=t[e];return n.split("{"+e.toUpperCase()+"}").join(r)},n)},n.prototype.match=function(t){return n.match(this.template,t)},n},lib.I18n=new function(){function n(n){this.messageBundle=this[n]}function t(n,t){this.locale=n,this[n]=t}function e(e,r){function i(n,t){return n in i.messageBundle&&(n=i.messageBundle[n]),t?lib.Template.match(n,t):n}return i.add=t,i.use=n,i.add(e,r),i.use(e),i}return e},lib.css=new function(){var i,o=this;o.prefix=i=new function(){var n={},e=["ms","O","Webkit","Moz"],r=new function(){var n=t.documentElement.style,e=n.constructor.prototype;return"top"in e?e:n};return function(t){var i,o,a;if(t in n)return n[t];if(t in r)return n[t]=t,t;for(o=t.charAt(0).toUpperCase()+t.slice(1),a=e.length;a--;)if(i=e[a]+o,i in r)return n[t]=i,i;return void(n[t]=void 0)}},new function(){var n={animation:["Delay","Direction","Duration","FillMode","IterationCount","Name","PlayState","TimingFunction"],transition:["Delay","Duration","Property","TimingFunction"],transform:["Origin","Style"]};e.keys(n).forEach(function(t){var e=i(t);e&&(o[t]=e,n[t].forEach(function(n){o[t+n]=e+n}))})},o.getAnimationNames=new function(){function n(n){return"none"!=n}var t=/,\s*/;return function(e){var r=e[o.animationName];return r?r.split(t).filter(n):[]}},o.set=new function(){function t(n,t){e.keys(t).forEach(function(e){n[i(e)]=t[e]})}return o.transition||o.animation?function(e,r){var i=n.getComputedStyle(e),a=o.getAnimationNames(i);return t(e.style,r),lib.event.awaitTransAnimEnd(e,a)}:function(n,e){return t(n.style,e),Promise.resolve(n)}},o.get=function(t,e){var o=n.getComputedStyle(t);return r.isArray(e)?e.reduce(function(n,t){return n[t]=o[i(t)],n},{}):o[i(e)]},o.getTransitionTime=o.transition?new function(){function n(n){return n.split(",").map(function(n){return a.parseFloat(n)||0})}function t(n,t){for(var e,r=0,i=f.max(t.length,n.length),o=0;i>o;)e=(n[o]||0)+(t[o]||0),e>r&&(r=e),o++;return f.ceil(1e3*r)}return function(e){return t(n(e[o.transitionDelay]),n(e[o.transitionDuration]))}}:function(){return 0}},lib.event=e.assign({preventDefault:function(n){n.preventDefault()},stopPropagation:function(n){n.stopPropagation()}},new function(){function n(n){n.eventTypes.forEach(function(t){n.element.removeEventListener(t,n.callback)})}function t(n,t,e,r){var i;return 3==arguments.length&&(r=e,e=t,t=void 0),t?(t+=","+t+" *",i=function(e){var i=e.target;i.matches&&i.matches(t)&&(r.handleEvent?r.handleEvent(e):r.call(n,e))}):i=r,"string"==typeof e&&(e=e.split(/[\s,]+/)),e.forEach(function(t){n.addEventListener(t,i)}),{element:n,eventTypes:e,callback:i}}function e(e,r,i,o){function a(t){n(u),o.handleEvent?o.handleEvent(t):o.call(e,t)}var u;3==arguments.length&&(o=i,i=r,r=void 0),u=t(e,r,i,a)}function r(n,t,r){return 2==arguments.length&&(r=t,t=void 0),new Promise(function(i){e(n,t,r,i)})}return{off:n,on:t,one:e,when:r}},new function(){function t(n,t){return n?t.reduce(function(t,e){return-1==n.indexOf(e)&&t.push(e),t},[]):t}function e(n,t){var e=n.indexOf(t);return-1!=e&&n.splice(e,1),n.length}function r(n,t){return t||(t=a.getAnimationNames(n)),t.length?new Promise(function(r){function i(o){o.target!=n||e(t,o.animationName)||(n.removeEventListener(c,i),r(n))}n.addEventListener(c,i)}):Promise.resolve(n)}function i(t,e){var r;return e||(e=n.getComputedStyle(t)),r=a.getTransitionTime(e),r?new Promise(function(e){n.setTimeout(function(){e(t)},r)}):Promise.resolve(t)}function o(e,o){var u=n.getComputedStyle(e),s=a.getAnimationNames(u);return s=t(o,s),Promise.all([r(e,s),i(e,u)]).then(function(){return e})}var a=lib.css,u=a.animation,s=a.transition,c={animation:"animationend",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"}[u],f=Promise.resolve;return{animationEnd:c,animationStart:{animation:"animationstart",MozAnimation:"mozAnimationStart",WebkitAnimation:"webkitAnimationStart"}[u],animationIteration:{animation:"animationiteration",MozAnimation:"mozAnimationIteration",WebkitAnimation:"webkitAnimationIteration"}[u],transitionEnd:{transition:"transitionend",MozTransition:"mozTransitionEnd",WebkitTransition:"webkitTransitionEnd"}[s],awaitAnimationEnd:u?r:f,awaitTransitionEnd:s?i:f,awaitTransAnimEnd:u||s?o:f}}),lib.dom=e.assign({ready:function(){return"complete"==t.readyState?Promise.resolve():lib.event.when(t,"DOMContentLoaded")}},new function(){function t(n,t,e){var r=n.className,i=n.classList;return e.forEach(function(n){i[t](n)}),r!=n.className}function e(n,t){return o(t[0],n,r.slice(t,1))}var i=lib.css,o=i.animation||i.transition?function(e,r,o){var a=n.getComputedStyle(e),u=i.getAnimationNames(a);return t(e,r,o)?lib.event.awaitTransAnimEnd(e,u):Promise.resolve(e)}:function(n,e,r){return t(n,e,r),Promise.resolve(n)};return{addClass:function(){return e("add",arguments)},removeClass:function(){return e("remove",arguments)},toggleClass:function(){return e("toggle",arguments)}}}),lib.request=new function(){function r(n,t){return encodeURIComponent(n)+"="+encodeURIComponent(t)}function i(n){return e.keys(n).reduce(function(t,e){return t.push(r(e,n[e])),t},[]).join("&")}function o(n){n.onload=null,n.onerror=null,n.ontimeout=null}function a(t){var r=(t.method||"GET").toUpperCase(),a=t.url||n.location.href,s=t.data,c=t.userName||"",f=t.password||"",h=t.timeout||0,m=!1!==t.async,p=!1!==t.caching,d=!0===t.credentials,g=t.mimeType,v={"X-Requested-With":"XMLHttpRequest"};return e(s)===s&&(s instanceof FormData?v["Content-Type"]="multipart/form-data":s=i(s)),"POST"==r?v["Content-Type"]=v["Content-Type"]||"application/x-www-form-urlencoded; charset=UTF-8":(p||(a+="?no-cache="+u()),"string"==typeof s&&(a+=(p?"?":"&")+s),s=null),t.headers&&e.assign(v,t.headers),new Promise(function(n,t){function i(){o(this),this.status>=200&&this.status<400?n(this):t(new l(this.statusText))}function u(){o(this),t(new l(this.statusText))}function p(){o(this),t(new l("time is out"))}!new function(){var n=new XMLHttpRequest;n.open(r,a,m,c,f),d&&(n.withCredentials=!0),g&&n.overrideMimeType(g),e.keys(v).forEach(function(t){n.setRequestHeader(t,v[t])}),n.onload=i,n.onerror=u,h&&(n.timeout=h,n.ontimeout=p),n.send(s)}})}var u=new function(){var n={};return function(){var t=f.random().toString().slice(2);return n[t]?u():(n[t]=1,t)}};return e.assign(a,{toQueryParam:r,toQueryString:i,get:function(n){return"string"==typeof n&&(n={url:n}),n.method="GET",a(n)},post:function(n){return n.method="POST",a(n)},json:function(n){return a.get(n).then(function(n){return JSON.parse(n.responseText)})},jsonp:function(n){return a.script(n)},script:function(r){var a,s,c;return"string"==typeof r&&(r={url:r}),a=r.url||n.location.href,s=r.data,c=r.caching!==!1,e(s)===s&&(s=i(s)),c||(a+="?no-cache="+u()),"string"==typeof s&&(a+=(c?"?":"&")+s),new Promise(function(n,r){t.head.appendChild(e.assign(t.createElement("script"),{onload:function(){o(this),this.remove(),n()},onerror:function(){o(this),this.remove(),r(new l("Could not load script"))},async:!0,defer:!0,src:a}))})}}),a},lib.cookie=new function(){function n(n){return l(f.cookie.replace(new c("(?:(?:^|.*;)\\s*"+h(n).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null}function e(n,t,e){e=e||{};var r="",i=e.end,u=e.path,c=e.domain,l=e.secure;if(!n||/^(?:expires|max\-age|path|domain|secure)$/i.test(n))return!1;if(i)switch(i.constructor){case a:r=1/0===i?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+i;break;case o:r="; expires="+i;break;case s:r="; expires="+i.toUTCString()}return f.cookie=h(n)+"="+h(t)+r+(c?"; domain="+c:"")+(u?"; path="+u:"")+(l?"; secure":""),!0}function r(n,t){t=t||{};var e=t.path,r=t.domain;return n&&i(n)?(f.cookie=h(n)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(r?"; domain="+r:"")+(e?"; path="+e:""),!0):!1}function i(n){return new c("(?:^|;\\s*)"+h(n).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(f.cookie)}function u(){return f.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/).map(l)}var f=t,l=decodeURIComponent,h=encodeURIComponent;return{get:n,set:e,has:i,remove:r,keys:u}}}(window,document,Object,Array,Function,String,Number,Boolean,Date,RegExp,Math,Error,TypeError,isFinite,isNaN,parseFloat,parseInt);