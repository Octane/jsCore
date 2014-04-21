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

##Polyfill

Object/Scope | Methods/Properties
:------------|:-----------------------------
global (`window`) | `FormData()`<sup>[12](#FormData)</sup>, `Set()`, `Map()`, `WeakSet()`, `WeakMap()`, `setImmediate()`, `clearImmediate()`<sup>[18](#clearImmediate)</sup>, `requestAnimationFrame()`, `cancelAnimationFrame()`, `getComputedStyle()`
`Object` generics | `.create()`<sup>[1](#Object.create)</sup>, `.assign()`<sup>[2](#Object.assign)</sup>, `.is()`, `.keys()`<sup>[3](#Object.keys)</sup>
`Array` generics<sup>[4](#Array_generics)</sup> | `.isArray()`, `.from()`, `.of()`, `.concat()`, `.every()`, `.fill()`, `.filter()`, `.find()`, `.findIndex()`, `.forEach()`, `.indexOf()`, `.join()`, `.lastIndexOf()`, `.map()`, `.pop()`, `.push()`, `.reduce()`, `.reduceRight()`, `.reverse()`, `.shift()`, `.slice()`<sup>[5](#Array.slice)</sup>, `.some()`, `.sort()`, `.splice()`<sup>[6](#Array.splice)</sup>, `.unshift()`
`Array.prototype` | `.every()`, `.fill()`, `.filter()`, `.find()`, `.findIndex()`, `.forEach()`, `.indexOf()`, `.lastIndexOf()`, `.map()`, `.reduce()`, `.reduceRight()`, `.some()`
`String` generics | `.charAt()`, `.charCodeAt()`, `.concat()`, `.contains()`, `.endsWith()`, `.indexOf()`, `.lastIndexOf()`, `.match()`, `.repeat()`, `.replace()`, `.search()`, `.slice()`, `.split()`, `.startsWith()`, `.substr()`, `.substring()`, `.toLowerCase()`, `.toUpperCase()`, `.trim()`
`String.prototype` | `.contains()`, `.endsWith()`, `.repeat()`, `.startsWith()`, `.trim()`
`Number` generics | `.isInteger()`, `.isFinite()`, `.isNaN()`, `.parseInt()`, `.parseFloat()`
`Math` generics | `.trunc()`, `.sign()`
`Function.prototype` | `.bind()`
`HTMLElement.prototype` | `.append()`, `.prepend()`, `.after()`, `.before()`, `.replace()`, `.remove()`, `.query()`, `.queryAll()`, `.matches()`, `.addEventListener()`, `.removeEventListner()`, `.dispatchEvent()`, `.children`<sup>[7](#HTMLElement.prototype.children)</sup>, `.firstElementChild`, `.lastElementChild`, `.childElementCount`, `.nextElementSibling`, `.previousElementSibling`, `.textContent`, `.classList`<sup>[8](#HTMLElement.prototype.classList)</sup>, `.dataset`<sup>[9](#HTMLElement.prototype.dataset)</sup>
`HTMLScriptElement.prototype` | `.onload()`<sup>[10](#HTMLScriptElement.prototype.onload)</sup>, `.onerror()`<sup>[10](#HTMLScriptElement.prototype.onload)</sup>
`document` | `.head`, `.createEvent()`<sup>[11](#document.createEvent)</sup>
`FormData.prototype` | `.append()`
`Event.prototype`<sup>[13](#Event.prototype)</sup> | `.initEvent()`<sup>[14](#Event.prototype.initEvent)</sup>, `.initUIEvent()`<sup>[14](#Event.prototype.initEvent)</sup>, `.initMouseEvent()`<sup>[14](#Event.prototype.initEvent)</sup>, `.initMutationEvent()`<sup>[14](#Event.prototype.initEvent)</sup>, `.initKeyEvent()`<sup>[14](#Event.prototype.initEvent)</sup>, `.initCustomEvent()`<sup>[14](#Event.prototype.initEvent)</sup>
`XMLHttpRequest.prototype` | `.send()`<sup>[15](#XMLHttpRequest)</sup>, `.onload()`, `.onerror()`, `.onabort()`, `.addEventListener()`, `.removeEventListener()`, `.dispatchEvent()`
`Date` generics | `.now()`
`Promise` generics<sup>[16](#Promise)</sup> | `.resolve()`, `.reject()`, `.all()`, `.race()`
`Promise.prototype` | `.then`, `.catch`<sup>[17](#Promise.prototype.catch)</sup>
`Set.prototype` | `.add()`, `.has()`, `.delete()`<sup>[18](#Set.prototype.delete)</sup>, `.clear()`, `.size`
`Map.prototype` | `.set()`, `.get()`, `.has()`, `.delete()`<sup>[18](#Set.prototype.delete)</sup>, `.clear()`, `.size`
`WeakSet.prototype` | `.add()`, `.has()`, `.delete()`<sup>[18](#Set.prototype.delete)</sup>, `.clear()`
`WeakMap.prototype` | `.set()`, `.get()`, `.has()`, `.delete()`<sup>[18](#Set.prototype.delete)</sup>, `.clear()`

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

<sup name="Array.slice">5</sup> – `Array.slice` supports array-like DOM-objects in IE8

<sup name="Array.splice">6</sup> – `Array.splice` fixes a [bug with array-like objects](http://javascript.ru/forum/307534-post71.html) in IE8

<sup name="HTMLElement.prototype.children">7</sup> – `element.children` fixes a bug with comment nodes in IE8

<sup name="HTMLElement.prototype.classList">8</sup> – `element.classList` doesn't update automatically when you change `element.className`

<sup name="HTMLElement.prototype.dataset">9</sup> – `element.dataset` doesn't add attribute when you add a new property

<sup name="HTMLScriptElement.prototype.onload">10</sup> – don't use `script.onload` and `script.onerror` with `script.onreadystatechange`

<sup name="document.createEvent">11</sup> – `document.createEvent` supports `"CustomEvent"`

<sup name="FormData">12</sup> – `FormData` doesn't support `<input type="file">`, but if you know file contents, it can be added using `append`

<sup name="Event.prototype">13</sup> –  global event constructors (`Event`, `CustomEvent`, etc.) not available, use `document.createEvent`

<sup name="Event.prototype.initEvent">14</sup> – event methods (`initEvent`, `initMouseEvent`, ect.) just copy all function parameters to the instance of `Event`, the main purpose is to set the type of the event without `IE<9` check

<sup name="XMLHttpRequest">15</sup> – `xhr.send` supports `FormData`

<sup name="Promise">16</sup> – `Promise` doesn't support [thenable](https://github.com/promises-aplus/promises-spec#terminology)-objects

<sup name="Promise.prototype.catch">17</sup> – IE8 doesn't allow to use a method called `catch`, use `catch_`

<sup name="Set.prototype.delete">18</sup> – IE8 doesn't allow to use a method called `delete`, use `delete_`

##lib

###lib.Template()

`lib.Template` is a very simple string templating tool (not to be confused with HTML-templating)
```javascript
var tmpl = new lib.Template("Hi, {NAME}");
tmpl.match({name: "John"}) //→ "Hi, John"
tmpl.match({name: "Luke"}) //→ "Hi, Luke"
```

###lib.I18n()

`lib.I18n` is a handy tool for the internationalization
```javascript
var i18n = new lib.I18n([locale[, messageBundle]]);
i18n.add(locale, messageBundle)
i18n.use(locale)
i18n(message[, replacements]) //→ string
```
example:
```javascript
var ruRU = {currency: "руб."},
    enUS = {currency: "$"},
    i18n = new lib.I18n;

i18n.add("ru-RU", ruRU);
i18n.add("en-US", enUS);

i18n.use("ru-RU");
100 + i18n("currency") // → "100руб."

i18n.use("en-US");
100 + i18n("currency") // → "100$"
```
`i18n` function can take a list of replacements
```javascript
var i18n = new lib.I18n("ru-Ru", {currency: "{COST} руб."});
i18n("currency", {cost: 100}) // → "100 руб."
```
###lib.html

####lib.html.parse()

`lib.html.parse` converts a HTML-code into a document fragment
```javascript
var docFragment = lib.html.parse("<h1>Example</h1><p>…</p>");
document.body.append(docFragment);
```

####lib.html.escape()

`lib.html.escape` converts special HTML-characters to mnemonics
```javascript
lib.html.escape("<h1>Example</h1>") // → "&lt;h1&gt;Example&lt;/h1&gt;"
```

####lib.html.unescape()

`lib.html.unescape` converts HTML-mnemonics to characters
```javascript
lib.html.unescape("&lt;h1&gt;Example&lt;/h1&gt;") // → "<h1>Example</h1>"
```

###lib.class_

`lib.class_.extend` is the standard inheritance pattern
```javascript
lib.class_.extend(Class, SuperClass);
Class.super_ == SuperClass //→ true
```

###lib.event

####lib.event.on()

`lib.event.on` registers a handler for an DOM event
```javascript
lib.event.on(eventType[, selector][, element], callback) //→ eventDetails
```
delegating events using the CSS-selector:
```javascript
lib.event.on("click", ".menu-item, .submenu-item", onMenuClick)
```

####lib.event.off()

`lib.event.off` removes the handler for the DOM event
```javascript
lib.event.off(eventDetails)
```
example:
```javascript
var eventDetails = lib.event.on("mouseup", document, onMouseUp);
lib.event.off(eventDetails);
```

####lib.event.one()

`lib.event.one` registers the handler for the DOM event, which runs once
```javascript
lib.event.one(eventType[, selector][, element], callback) //→ eventDetails
```
example:
```javascript
lib.event.one("load", window, onLoaded);
```

####lib.event.when()

`lib.event.when` like `lib.event.one`, but returns a promise, the callback is passed to `then`
```javascript
lib.event.when(eventType[, selector][, element]) //→ promise
```
example:
```javascript
lib.event.when("click", ".some-class").then(doSomething);
```

####lib.event.preventDefault()

`lib.event.preventDefault` cancels the default action of the event
```javascript
lib.event.on("submit", someForm, lib.event.preventDefault);
```

####lib.event.stopPropagation()

`lib.event.stopPropagation` prevents further propagation of the event
```javascript
lib.event.on("click", someElement, lib.event.stopPropagation);
```

###lib.array

####lib.array.count()

`lib.array.count` counts the actual number of elements
```javascript
var iterable = [,"a",,"b",];
iterable.length //→ 4
lib.array.count(iterable) //→ 2
```

####lib.array.all()

`lib.array.all` like `Array.every`, but it is sensitive to the length of the array and missing indexes
```javascript
[].every(lib.isTrue) //→ true
lib.array.all([], lib.isTrue) //→ false
```

####lib.array.unique()

`lib.array.unique` returns the new array consisting only of unique elements of the passed array
```javascript
lib.array.unique([1, 2, 1]) //→ [1, 2]
```

####lib.array.refine()

`lib.array.refine` shifts array indexes, so that was not missed
```javascript
lib.array.refine([1,,2]) //→ [1, 2]
```

####lib.array.contains()

`lib.array.contains` determines whether an element may be found within the array
```javascript
lib.array.contains(["a", "b"], "a") //→ true
```

####lib.array.shuffle()

`lib.array.shuffle` returns the new array consisting of mixed elements of the passed array
```javascript
lib.array.shuffle(iterbale) //→ array
```

####lib.array.range()

`lib.array.range` creates the array of integers
```javascript
lib.array.range(2, 7) //→ [2, 3, 4, 5, 6]
lib.array.range(5) //→ [0, 1, 2, 3, 4]
```

####lib.array.remove()

`lib.array.remove` removes the element from the array
```javascript
var list = ["a", "b", "c"];
lib.array.remove(list, "b");
console.log(list) //→ ["a", "c"]
```

###lib.is

`lib.isTrue`, `lib.isFalse`, `lib.isHTML`, `lib.isObject`, `lib.isHTMLElement` are helper functions for use, e.g., in `Array` iteration methods
```javascript
if (testResults.every(lib.isTrue)) {
    //do something
}
```

###lib.dom

####lib.dom.query()

`lib.dom.query` returns a promise to perform actions asynchronously, if a element found
```javascript
lib.dom.query("#nav-menu").then(function (element) {
    //use element
});
```

####lib.dom.queryAll()

`lib.dom.queryAll` returns the promise to perform actions asynchronously, if elements found
```javascript
lib.dom.queryAll(".menu-item", menuElement).then(function (list) {
    //use list
});
```

####lib.dom.ready()

`lib.dom.ready` returns the promise to perform actions after `DOMContentLoaded`
```javascript
lib.dom.ready().then(function () {
    //do something
});
```

###lib.date

####lib.data.isLeapYear()

`lib.date.isLeapYear` determines whether a leap year
```javascript
lib.date.isLeapYear([date]) //→ boolean
```
where `date` is instance of `Date` or the four-digit number

####lib.date.monthLength()

`lib.date.monthLength` returns the number of days in a month
```javascript
lib.date.monthLength(monthIndex, fullYear) //→ number
```
if instead `monthIndex` pass the instance of `Date`, then the second argument not needed

###lib.request()

`lib.request` performs a request to a server using `XMLHttpRequest`, returns a promise
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

`lib.request.get` like `lib.request`, but it always performs the GET request and lets not pass additional parameters
```javascript
lib.request.get(url) //→ promise
//or
lib.request.get(params) //→ promise
```

####lib.request.post()

`lib.request.post` like `lib.request`, but it always performs the POST request

####lib.request.json()

`lib.request.json` is shorthand for:
```javascript
lib.request.get(params).then(function (xhr) {
   return JSON.parse(xhr.responceText);
});
```

####lib.request.script()

`lib.request.script` loads a JavaScript file from the server request, then execute it, returns the promise
```javascript
lib.request.script({
    url:     String,
    data:    String|Object,
    caching: Boolean
}) //→ promise
```
`data` can be the string or the object, which automatically converted into the query string

####lib.request.jsonp()

`lib.request.jsonp` is equivalent to `lib.request.script`

####lib.request.toQueryParam()

`lib.request.toQueryParam` converts key-value pairs into the query string
```javascript
lib.request.toQueryParam("chr", "ю") //→ "chr=%D1%8E"
```

####lib.request.toQueryString()

`lib.request.toQueryString` converts the object containing key-value pairs into the query string
```javascript
lib.request.toQueryString({
    chr1: "ю",
    chr2: "я"
}) //→ "chr1=%D1%8E&chr2=%D1%8F"
```

##License

jsCore is released under the [MIT license](https://github.com/Octane/jsCore/blob/master/MIT-LICENSE.txt).
