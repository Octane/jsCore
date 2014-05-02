#<img src="https://raw.githubusercontent.com/Octane/jsCore/master/jscore_logo.png" width="66" height="66" align="left" valign="middle" hspace="10" alt="jsCore logotype">jsCore JavaScript library

The library consists of a complex polyfill and a set of methods in the `lib` namespace.

To use jsCore, just drop a single JavaScript file into your page:
```html
<script src="jscore.js"></script>
```
Download the [latest jsCore from GitHub](https://raw.githubusercontent.com/Octane/jsCore/master/jscore.js).

If you don't want to support IE8, rebuild `jscore.js` using `build.js`:
```
node build.js --no_ie8
```

##Contents
 - [`Polyfill`](#polyfill)
    - [`Notes/known issues`](#notesknown-issues)
 - [Namespace `lib`](#lib)
    - [Method `.classExtends`](#libclassextends)
    - [Constructor `.Template()`](#libtemplate)
        - [Instance method `.match()`](#libtemplate)
    - [Constructor `.I18n()`](#libi18n)
        - [Instance methods `.add()` and `.use()`](#libi18n)
    - [Namespace `.html`](#libhtml)
        - [Method `.parse()`](#libhtmlparse)
        - [Method `.escape()`](#libhtmlescape)
        - [Method `.unescape()`](#libhtmlunescape)
    - [Namespace `.array`](#libarray)
        - [Method `.count()`](#libarraycount)
        - [Method `.all()`](#libarrayall)
        - [Method `.unique()`](#libarrayunique)
        - [Method `.refine()`](#libarrayrefine)
        - [Method `.contains()`](#libarraycontains)
        - [Method `.shuffle()`](#libarrayshuffle)
        - [Method `.range()`](#libarrayrange)
        - [Method `.remove()`](#libarrayremove)
    - [Namespace `.is`](#libis)
        - [Methods `.isTrue()`, `.isFalse()`, `.isHTML()`, `.isObject()` and `.isHTMLElement()`](#libis)
    - [Namespace `.css`](#libcss)
        - [Method `.prefix()`](#libcssprefix)
        - [Method `.get()`](#libcssget)
        - [Method `.set()`](#libcssset)
        - [Method `.getTransitionTime()`](#libcssgettransitiontime)
        - [Prefixed property names](#prefixed-property-names)
    - [Namespace `.dom`](#libdom)
        - [Method `.ready()`](#libdomready)
        - [Methods `.addClass()`, `.removeClass()` and `.toggleClass()`](#libdomaddremovetoggleclass)
    - [Namespace `.event`](#libevent)
        - [Method `.on()`](#libeventon)
        - [Method `.off()`](#libeventoff)
        - [Method `.one()`](#libeventone)
        - [Method `.when()`](#libeventwhen)
        - [Method `.preventDefault()`](#libeventpreventdefault)
        - [Method `.stopPropagation()`](#libeventstoppropagation)
        - [Method `.awaitTransitionEnd()`](#libeventawaittransitionend)
        - [Method `.awaitAnimationEnd()`](#libeventawaitanimationend)
        - [Method `.awaitTransAnimEnd()`](#libeventawaittransanimend)
        - [Prefixed event types](#prefixed-event-types)
    - [Namespace `.date`](#libdate)
        - [Method `.isLeapYear()`](#libdataisleapyear)
        - [Method `.monthLength()`](#libdatemonthlength)
    - [Namespace and method `.request()`](#librequest)
        - [Method `.get()`](#librequestget)
        - [Method `.post()`](#librequestpost)
        - [Method `.json()`](#librequestjson)
        - [Method `.script()`](#librequestscript)
        - [Method `.jsonp()`](#librequestjsonp)
        - [Method `.toQueryParam()`](#librequesttoqueryparam)
        - [Method `.toQueryString()`](#librequesttoquerystring)
 - [`License`](#license)

##Polyfill

Object/Scope | Methods/Properties
:------------|:-----------------------------
global | `FormData()`<sup>[12](#FormData)</sup>, `Set()`, `Map()`, `WeakSet()`, `WeakMap()`
`window` | `.setImmediate()`, `.clearImmediate()`, `.requestAnimationFrame()`, `.cancelAnimationFrame()`, `.getComputedStyle()`
`Object` generics | `.create()`<sup>[1](#Object.create)</sup>, `.assign()`<sup>[2](#Object.assign)</sup>, `.is()`, `.keys()`<sup>[3](#Object.keys)</sup>
`Array` generics<sup>[4](#Array_generics)</sup> | `.isArray()`, `.from()`, `.of()`, `.concat()`, `.every()`, `.fill()`, `.filter()`, `.find()`, `.findIndex()`, `.forEach()`, `.indexOf()`, `.join()`, `.lastIndexOf()`, `.map()`, `.pop()`, `.push()`, `.reduce()`, `.reduceRight()`, `.reverse()`, `.shift()`, `.slice()`<sup>[5](#Array.slice)</sup>, `.some()`, `.sort()`, `.splice()`<sup>[6](#Array.splice)</sup>, `.unshift()`
`Array.prototype` | `.every()`, `.fill()`, `.filter()`, `.find()`, `.findIndex()`, `.forEach()`, `.indexOf()`, `.lastIndexOf()`, `.map()`, `.reduce()`, `.reduceRight()`, `.some()`
`String` generics | `.charAt()`, `.charCodeAt()`, `.concat()`, `.contains()`, `.endsWith()`, `.indexOf()`, `.lastIndexOf()`, `.match()`, `.repeat()`, `.replace()`, `.search()`, `.slice()`, `.split()`, `.startsWith()`, `.substr()`, `.substring()`, `.toLowerCase()`, `.toUpperCase()`, `.trim()`
`String.prototype` | `.contains()`, `.endsWith()`, `.repeat()`, `.startsWith()`, `.trim()`
`Number` generics | `.isInteger()`, `.isFinite()`, `.isNaN()`, `.parseInt()`, `.parseFloat()`
`Math` generics | `.trunc()`, `.sign()`
`Function.prototype` | `.bind()`
`Text.prototype` | `.textContent`
`HTMLElement.prototype` | `.append()`, `.prepend()`, `.after()`, `.before()`, `.replace()`, `.remove()`, `.query()`, `.queryAll()`, `.matches()`, `.addEventListener()`, `.removeEventListner()`, `.dispatchEvent()`, `.children`<sup>[7](#HTMLElement.prototype.children)</sup>, `.firstElementChild`, `.lastElementChild`, `.childElementCount`, `.nextElementSibling`, `.previousElementSibling`, `.textContent`, `.classList`<sup>[8](#HTMLElement.prototype.classList)</sup>, `.dataset`<sup>[9](#HTMLElement.prototype.dataset)</sup>
`HTMLScriptElement.prototype` | `.onload()`<sup>[10](#HTMLScriptElement.prototype.onload)</sup>, `.onerror()`<sup>[10](#HTMLScriptElement.prototype.onload)</sup>
`CSSStyleDeclaration.prototype` | `.getPropertyValue()`, `.removeProperty()`, `.setProperty()`, `.cssFloat`, `.opacity`
`document` | `.head`, `.createEvent()`<sup>[11](#document.createEvent)</sup>
`FormData.prototype` | `.append()`
`Event.prototype`<sup>[13](#Event.prototype)</sup> | `.initEvent()`<sup>[14](#Event.prototype.initEvent)</sup>, `.initUIEvent()`<sup>[14](#Event.prototype.initEvent)</sup>, `.initMouseEvent()`<sup>[14](#Event.prototype.initEvent)</sup>, `.initCustomEvent()`
`XMLHttpRequest.prototype` | `.send()`<sup>[15](#XMLHttpRequest)</sup>, `.onload()`, `.onerror()`, `.onabort()`, `.addEventListener()`, `.removeEventListener()`, `.dispatchEvent()`
`Date` generics | `.now()`
`Promise` generics<sup>[16](#Promise)</sup> | `.resolve()`, `.reject()`, `.all()`, `.race()`
`Promise.prototype` | `.then`, `.catch`<sup>[17](#catch-delete)</sup>
`Set.prototype` | `.add()`, `.has()`, `.delete()`<sup>[17](#catch-delete)</sup>, `.clear()`, `.size`
`Map.prototype` | `.set()`, `.get()`, `.has()`, `.delete()`<sup>[17](#catch-delete)</sup>, `.clear()`, `.size`
`WeakSet.prototype` | `.add()`, `.has()`, `.delete()`<sup>[17](#catch-delete)</sup>, `.clear()`
`WeakMap.prototype` | `.set()`, `.get()`, `.has()`, `.delete()`<sup>[17](#catch-delete)</sup>, `.clear()`

###Notes/Known Issues

<sup name="Object.create">1</sup> – `Object.create` implementation:

 - only accepts the first parameter in IE8
 - `Object.create(null) instanceof Object` returns `true` in IE8
 - fixes a [bug with numeric keys](http://webreflection.blogspot.com/2014/04/all-ie-objects-are-broken.html) in IE9-11

<sup name="Object.assign">2</sup> – [`Object.assign()`](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign) supports a variable number of sources [@rwaldron](https://twitter.com/rwaldron/status/454114058640183296)

<sup name="Object.keys">3</sup> – `Object.keys` fixes a [DontEnum bug](https://developer.mozilla.org/en-US/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug) in IE8

<sup name="Array_generics">4</sup> – some Firefox's built-in methods are missed in standard or in drafts of future standards, but these must-have features
```javascript
< Array.slice.toString()
> "function slice() {
     [native code]
  }"
```

<sup name="Array.slice">5</sup> – `Array.slice()` supports array-like DOM objects in IE8

<sup name="Array.splice">6</sup> – `Array.splice()` fixes a [bug with array-like objects](http://javascript.ru/forum/307534-post71.html) in IE8

<sup name="HTMLElement.prototype.children">7</sup> – `element.children` fixes a bug with comment nodes in IE8

<sup name="HTMLElement.prototype.classList">8</sup> – `element.classList` doesn't update automatically when you change `element.className`

<sup name="HTMLElement.prototype.dataset">9</sup> – `element.dataset` doesn't add attribute when you add a new property

<sup name="HTMLScriptElement.prototype.onload">10</sup> – don't use `script.onload()` and `script.onerror()` with `script.onreadystatechange()`

<sup name="document.createEvent">11</sup> – `document.createEvent()` supports `CustomEvent`

<sup name="FormData">12</sup> – `FormData()` doesn't support `<input type="file">`, but if you know file contents, it can be added using `.append()`

<sup name="Event.prototype">13</sup> –  global event constructors (`Event()`, `CustomEvent()`, etc.) not available, use `document.createEvent()`

<sup name="Event.prototype.initEvent">14</sup> – event methods (`.initEvent()`, `.initMouseEvent()`, etc.) just copy all function parameters to the instance of `Event()`, the main purpose is to set the type of the event without `IE8` check

<sup name="XMLHttpRequest">15</sup> – `xhr.send()` supports `FormData()`

<sup name="Promise">16</sup> – `Promise()` doesn't support [thenable](https://github.com/promises-aplus/promises-spec#terminology)-objects

<sup name="catch-delete">17</sup> – IE8 doesn't allow to use the dot notation as accessor for methods called “catch” and “delete”

##lib

###lib.classExtends()

`.classExtends()` is the standard inheritance pattern
```javascript
lib.classExtends(Class, SuperClass);
Class.Super //→ SuperClass
```

###lib.Template()

`.Template()` is a very simple string templating tool (not to be confused with HTML templating)
```javascript
var tmpl = new lib.Template('Hi, {NAME}');
tmpl.match({name: 'John'}) //→ 'Hi, John'
tmpl.match({name: 'Luke'}) //→ 'Hi, Luke'
```

###lib.I18n()

`.I18n()` is a handy tool for the internationalization
```javascript
var i18n = new lib.I18n([locale[, messageBundle]]);
i18n.add(locale, messageBundle)
i18n.use(locale)
i18n(message[, replacements]) //→ string
```
example:
```javascript
var ruRU = {currency: 'руб.'},
    enUS = {currency: '$'},
    i18n = new lib.I18n;

i18n.add('ru-RU', ruRU);
i18n.add('en-US', enUS);

i18n.use('ru-RU');
100 + i18n('currency') // → '100руб.'

i18n.use('en-US');
100 + i18n('currency') // → '100$'
```
`i18n()` function can take a list of replacements
```javascript
var i18n = new lib.I18n('ru-Ru', {currency: '{COST} руб.'});
i18n('currency', {cost: 100}) // → '100 руб.'
```
###lib.html

####lib.html.parse()

`.parse()` converts a HTML code into a document fragment
```javascript
var docFragment = lib.html.parse('<h1>Example</h1><p>...</p>');
document.body.append(docFragment);
```

####lib.html.escape()

`.escape()` converts special HTML characters to mnemonics
```javascript
lib.html.escape('<h1>Example</h1>') // → '&lt;h1&gt;Example&lt;/h1&gt;'
```

####lib.html.unescape()

`.unescape()` converts HTML mnemonics to characters
```javascript
lib.html.unescape('&lt;h1&gt;Example&lt;/h1&gt;') // → '<h1>Example</h1>'
```

###lib.array

####lib.array.count()

`.count()` counts the actual number of elements
```javascript
var iterable = [,'a',,'b',];
iterable.length //→ 4
lib.array.count(iterable) //→ 2
```

####lib.array.all()

`.all()` like `Array.every()`, but it is sensitive to the length of the array and missing indexes
```javascript
[].every(lib.isTrue) //→ true
lib.array.all([], lib.isTrue) //→ false
```

####lib.array.unique()

`.unique()` returns the new array consisting only of unique elements of the passed array
```javascript
lib.array.unique([1, 2, 1]) //→ [1, 2]
```

####lib.array.refine()

`.refine()` shifts array indexes, so that was not missed
```javascript
lib.array.refine([1,,2]) //→ [1, 2]
```

####lib.array.contains()

`.contains()` determines whether an element may be found within the array
```javascript
lib.array.contains(['a', 'b'], 'a') //→ true
```

####lib.array.shuffle()

`.shuffle()` returns the new array consisting of mixed elements of the passed array
```javascript
lib.array.shuffle(iterbale) //→ array
```

####lib.array.range()

`.range()` creates the array of integers
```javascript
lib.array.range(2, 7) //→ [2, 3, 4, 5, 6]
lib.array.range(5) //→ [0, 1, 2, 3, 4]
```

####lib.array.remove()

`.remove()` removes the element from the array
```javascript
var list = ['a', 'b', 'c'];
lib.array.remove(list, 'b');
console.log(list) //→ ['a', 'c']
```

###lib.is

`.isTrue()`, `.isFalse()`, `.isHTML()`, `.isObject()`, `.isHTMLElement()` are helper functions for use, e.g., in `Array` iteration methods
```javascript
if (testResults.every(lib.isTrue)) {
    //do something
}
```

###lib.css

####lib.css.prefix()

`.prefix()` returns prefixed `propertyName` or `undefined`
```javascript
lib.css.prefix(propertyName) //→ prefixedPropertyName
```
example:
```javascript
lib.css.prefix('animationName') //→ 'WebkitAnimationName'
```

####lib.css.get()

`.get()` returns computed property values
```javascript
lib.css.get(element, property) //→ string
lib.css.get(element, arrayOfPropertyNames) //→ object
```
example:
```javascript
//single property
var delay = lib.css.get(element, 'animationDelay'); //animationDelay will be prefixed automatically
if (delay) {
    //do something
}

//several properties
var rect = lib.css.get(element, ['top', 'left', 'height', 'width']);
if (parseInt(rect.width) > someValue) {
    //do something
}
```

####lib.css.set()

`.set()` changes property values and returns a promise that is fulfilled at the end of transitions and animations
```javascript
lib.css.set(element, properties) //→ promise
```
example:
```javascript
lib.css.set(element, {
    //properties will be prefixed automatically
    animationName: 'some-name',
    animationDuration: '5s'
}).then(doSomething);
```

####lib.css.getTransitionTime()

`.getTransitionTime()` returns the maximum CSS transition time
```javascript
lib.css.getTransitionTime(style) //→ number (ms)
```

####Prefixed property names

For quick access prepared prefixed CSS animation, transition and transform property names: `.animation`, `.animationName`, `.transitionProperty`, `.transform`, etc.
```javascript
if (lib.css.animation) {
    element.style[lib.css.animationDelay] = '5s';
}
```

###lib.dom

####lib.dom.ready()

`.ready()` returns a promise to perform actions after `DOMContentLoaded`
```javascript
lib.dom.ready().then(function () {
    //do something
});
```

####lib.dom.add|remove|toggleClass()

`.addClass()`, `.removeClass()` and `.toggleClass()` return the promise to perform actions at the end of all CSS transitions and animations
```javascript
lib.dom.addClass(element, class1[, class2[, ...]]], element) //→ promise
lib.dom.removeClass(element, class1[, class2[, ...]]], element) //→ promise
lib.dom.toggleClass(element, class1[, class2[, ...]]], element) //→ promise
```
for example, call `doSomething` after *3 seconds* of the transition:
```css
.animated {
    position: fixed;
    top: 0;
    left: 0;
    transition: left 3s, top 1s;
}
.trans1 {
    top: 50%;
}
.trans2 {
    left: 50%;
}
```
```javascript
var element = document.query('.animated');
lib.dom.addClass(element, 'trans1', 'trans2').then(doSomething);
```

###lib.event

####lib.event.on()

`.on()` registers a handler for an DOM event
```javascript
lib.event.on(element[, selector], eventTypes, callback) //→ eventDetails
```
for example, delegating events using the CSS selector:
```javascript
lib.event.on(menuContainer, '.menu-item', 'click', onMenuClick);
```

####lib.event.off()

`.off()` removes the handler for the DOM event
```javascript
lib.event.off(eventDetails)
```
example:
```javascript
var eventDetails = lib.event.on(window, 'focus blur', doSomething);
lib.event.off(eventDetails);
```

####lib.event.one()

`.one()` registers the handler for the DOM event, which runs once
```javascript
lib.event.one(element[, selector], eventTypes, callback)
```
example:
```javascript
lib.event.one(window, 'load', onLoad);
```

####lib.event.when()

`.when()` like `.one()`, but returns a promise, the callback is passed to `.then()`
```javascript
lib.event.when(element[, selector], eventTypes) //→ promise
```
example:
```javascript
lib.event.when(document, 'body', 'click').then(doSomething);
```

####lib.event.preventDefault()

`.preventDefault()` cancels the default action of the event
```javascript
lib.event.on(someForm, 'submit', lib.event.preventDefault);
```

####lib.event.stopPropagation()

`.stopPropagation()` prevents further propagation of the event
```javascript
lib.event.on(someElement, 'click', lib.event.stopPropagation);
```

####lib.event.awaitTransitionEnd()

`.awaitTransitionEnd()` returns the promise that is fulfilled at the end of CSS transitions
```javascript
lib.event.awaitTransitionEnd(element[, computedStyle]) //→ promise
```

####lib.event.awaitAnimationEnd()

`.awaitAnimationEnd()` returns the promise that is fulfilled at the end of CSS animations
```javascript
lib.event.awaitAnimationEnd(element[, previousAnimations]) //→ promise
```

####lib.event.awaitTransAnimEnd()

`.awaitTransAnimEnd()` returns the promise that is fulfilled at the end of transitions and animations
```javascript
lib.event.awaitTransAnimEnd(element[, previousAnimations]) //→ promise
```

####Prefixed event types

For quick access prepared prefixed animation and transition event types: `.animationStart`, `.animationEnd`, `.animationIteration` and `.transitionEnd`
```javascript
if (lib.event.animationEnd) {
    element.addEventListener(lib.event.animationEnd, onAnimationEnd);
}
```

###lib.date

####lib.data.isLeapYear()

`.isLeapYear()` determines whether a leap year
```javascript
lib.date.isLeapYear([date]) //→ boolean
```
where `date` is instance of `Date()` or the four-digit number

####lib.date.monthLength()

`.monthLength()` returns the number of days in a month
```javascript
lib.date.monthLength(monthIndex, fullYear) //→ number
```
if instead `monthIndex` pass the instance of `Date()`, then the second argument not needed

###lib.request()

`.request()` performs a request to a server using `XMLHttpRequest()`, returns a promise
```javascript
lib.request({
    method:   String,
    url:      String,
    data:     String|Object|FormData,
    userName: String,
    password: String,
    timeout:  Number,
    async:    Boolean,
    caching:  Boolean,
    mimeType: String,
    headers:  Object
}) //→ promise
```
`data` can be a string, object (automatically converted into a query string), or an instance of `FormData`

####lib.request.get()

`.get()` like `.request()`, but it always performs the GET request and lets not pass additional parameters
```javascript
lib.request.get(url) //→ promise
//or
lib.request.get(params) //→ promise
```

####lib.request.post()

`.post()` like `.request()`, but it always performs the POST request

####lib.request.json()

`.json()` is shorthand for:
```javascript
lib.request.get(params).then(function (xhr) {
   return JSON.parse(xhr.responceText);
});
```

####lib.request.script()

`.script()` loads a JavaScript file from the server request, then execute it, returns the promise
```javascript
lib.request.script({
    url:     String,
    data:    String|Object,
    caching: Boolean
}) //→ promise
```
`data` can be the string or the object, which automatically converted into the query string

####lib.request.jsonp()

`.jsonp()` is equivalent to `.script()`

####lib.request.toQueryParam()

`.toQueryParam()` converts key-value pairs into the query string
```javascript
lib.request.toQueryParam('chr', 'ю') //→ 'chr=%D1%8E'
```

####lib.request.toQueryString()

`.toQueryString()` converts the object containing key-value pairs into the query string
```javascript
lib.request.toQueryString({
    chr1: 'ю',
    chr2: 'я'
}) //→ 'chr1=%D1%8E&chr2=%D1%8F'
```

##License

jsCore is released under the [MIT license](https://github.com/Octane/jsCore/blob/master/MIT-LICENSE.txt).
