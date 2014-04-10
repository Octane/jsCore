#<img src="https://raw.githubusercontent.com/Octane/jsCore/master/logo.png" width="66" height="66" align="left" valign="middle" hspace="10" alt="jsCore logotype">jsCore JavaScript library

**polyfill + set of methods**

Библиотека состоит из комплексного полифила и набора методов в неймспейсе lib.
Если не требуется поддержка IE8, пересоберите jscore.js с помощью build.js, исключив из списка файлы, находящиеся в папке ie8.

##Polyfill

**Object generic methods**

`is`, `keys`, `create` (только 1 аргумент), `assign` (в IE8 неперечислимые свойства не копируются)

**Array generic methods**

`isArray`, `from`, `of`, `concat`, `every`, `fill`, `filter`, `find`, `findIndex`, `forEach`, `indexOf`, `join`, `lastIndexOf`, `map`, `pop`, `push`, `reduce`, `reduceRight`, `reverse`, `shift`, `slice`, `some`, `sort`, `splice`, `unshift`

**Array.prototype**

`every`, `fill`, `filter`, `find`, `findIndex`, `forEach`, `indexOf`, `lastIndexOf`, `map`, `reduce`, `reduceRight`, `some`

**String generic methods**

`charAt`, `charCodeAt`, `concat`, `contains`, `endsWith`, `indexOf`, `lastIndexOf`, `match`, `repeat`, `replace`, `search`, `slice`, `split`, `startsWith`, `substr`, `substring`, `toLowerCase`, `toUpperCase`, `trim`

**String.prototype**

`contains`, `endsWith`, `repeat`, `startsWith`, `trim`

**Number generic methods**

`isInteger`, `isFinite`, `isNaN`, `toInteger`, `parseInt`, `parseFloat`

**Function.prototype**

`bind`

**HTMLElement.prototype**

`append`, `prepend`, `after`, `before`, `replace`, `remove`, `query`, `queryAll`, `matches`, `children`, `firstElementChild`, `lastElementChild`, `childElementCount`, `nextElementSibling`, `previousElementSibling`, `addEventListener`, `removeEventListner`, `dispatchEvent`, `textContent`, `classList`, `dataset` (не добавляет новые атрибуты),

**HTMLScriptElement.prototype**

`onload`, `onerror` – не используйте эти события одновременно с onreadystatechange

**document**

`head`, `createEvent`

**FormData**

не поддерживает `<input type="file">`, но метод append позволяет добавлять файлы

**FormData.prototype**

`append`

**Event**

глобальные конструкторы недоступны, используйте document.createEvent

`initEvent`, `initUIEvent`, `initMouseEvent`, `initMutationEvent`, `initKeyEvent`, `initCustomEvent`

**XMLHttpRequest**

позволяет отправлять FormData

**XMLHttpRequest.prototype**

`onload`, `onerror`, `onabort`, `addEventListener`, `removeEventListener`, `dispatchEvent`

**Date generic methods**

`now`

**Promise generic methods**

`resolve`, `reject`, `all`, `race`

**Promise.prototype**

`then`, `catch`

**Глобальные функции**

`setImmediate`, `clearImmediate`, `requestAnimationFrame`, `cancelAnimationFrame`, `getComputedStyle`

##lib.Template

`lib.Template` конструктор простых строковых шаблонов (не путать с HTML-шаблонизаторами)
```javascript
var tmpl = new lib.Template("Hi, {NAME}");
tmpl.match({name: "John"}) //→ "Hi, John"
tmpl.match({name: "Luke"}) //→ "Hi, Luke"
```

##lib.I18n

`lib.I18n` удобный инструмент для интернационализации
```javascript
var i18n = new lib.I18n(locale, messageBundle);
i18n.add(locale, messageBundle)
i18n.use(locale)
i18n(message, replacements) //→ string
```
пример:
```javascript
var ru = {currency: "руб."},
    en = {currency: "$"},
    i18n = new lib.I18n;

i18n.add("ru-ru", ru);
i18n.add("en-us", en);

i18n.use("ru-ru");
100 + i18n("currency") // → "100руб."

i18n.use("en-us");
100 + i18n("currency") // → "100$"
```
функция может принимать список автозамен
```javascript
var i18n = new lib.I18n("ru-ru", {currency: "{COST} руб."});
i18n("currency", {cost: 100}) // → "100 руб."
```
##lib.html

`lib.html.parse` преобразует HTML-код в DocumentFragment
```javascript
var docFragment = lib.html.parse("<h1>Example</h1><p>…</p>");
document.body.append(docFragment);
```

`lib.html.escape` преобразует специальные HTML-символы в соответствующие мнемоники
```javascript
lib.html.escape("<h1>Example</h1>") // → "&lt;h1&gt;Example&lt;/h1&gt;"
```

`lib.html.unescape` преобразует HTML-мнемоники в соответствующие символы
```javascript
lib.html.unescape("&lt;h1&gt;Example&lt;/h1&gt;") // → "<h1>Example</h1>"
```

##lib.class_

`lib.class_.extend` заменяет прототип указанного конструктора объектом Object.create(SuperClass.prototype) и создает ссылку на SuperClass
```javascript
lib.class_.extend(Class, SuperClass);
Class.super_ == SuperClass //→ true
```

##lib.event

`lib.event.on` регистрирует обработчик события
```javascript
lib.event.on(eventType[, selector][, element], callback) //→ eventDetails
```
если указан селектор, происходит делегирование события:
```javascript
lib.event.on("click", ".menu-item, .submenu-item", onMenuClick)
```

`lib.event.off` удаляет обработчик события
```javascript
lib.event.off(eventDetails)
```
пример:
```javascript
var eventDetails = lib.event.on("mouseup", document, onMouseUp);
lib.event.off(eventDetails);
```

`lib.event.one` регистрирует обработчик события, который выполнится один раз
```javascript
lib.event.one(eventType[, selector][, element], callback) //→ eventDetails
```
пример:
```javascript
lib.event.one("load", window, onLoaded);
```

`lib.event.when` похож на one, но возвращает promise, а callback передается в then
```javascript
lib.event.when(eventType[, selector][, element]) //→ promise
```
пример:
```javascript
lib.event.when("click", ".some-class").then(doSomething);
```

`lib.event.preventDefault` отменяет действие браузера по умолчанию
```javascript
lib.event.on("submit", someForm, lib.event.preventDefault);
```

`lib.event.stopPropagation` останавливает всплывание события
```javascript
lib.event.on("click", someElement, lib.event.stopPropagation);
```

##lib.array

`lib.array.count` подсчет реального количества элементов в массиве
```javascript
var iterable = [,"a",,"b",];
iterable.length //→ 4
lib.array.count(iterable) //→ 2
```

`lib.array.all` аналогичен Array.every, но реагирует на длину массива и проущенные индексы
```javascript
[].every(lib.isTrue) //→ true
lib.array.all([], lib.isTrue) //→ false
```

`lib.array.unique` возвращает новый массив, состоящий только из уникальных элементов переданного массива
```javascript
lib.array.unique([1, 2, 1]) //→ [1, 2]
```

`lib.array.refine` возвращает новый массив, состоящий из существующих элементов переданного массива
```javascript
lib.array.refine([1,,2]) //→ [1, 2]
```

`lib.array.contains` определяет, находится ли указанный элемент в массиве
```javascript
lib.array.contains(["a", "b"], "a") //→ true
```

`lib.array.shuffle` возвращает новый массив, состоящий из перемешанных элементов переданного массива
```javascript
lib.array.range(2, 7) //→ [2, 3, 4, 5, 6]
lib.array.range(5) //→ [0, 1, 2, 3, 4]
```

`lib.array.range` возвращает новый массив, заполненный числовыми значениями в указанном диапазоне
```javascript
lib.array.range(2, 7) //→ [2, 3, 4, 5, 6]
lib.array.range(5) //→ [0, 1, 2, 3, 4]
```

##lib.is

`lib.isTrue`, `lib.isFalse`, `lib.isHTML`, `lib.isObject`, `lib.isHTMLElement` вспомогательные функции для использования, например, в Array iteration methods:
```javascript```
if (testResults.every(lib.isTrue)) {
    …
}
```

##lib.dom

`lib.dom.query` возвращает promise, чтобы асинхронно выполнить действия, если элемент найден
```javascript
lib.dom.query("#nav-menu").then(function (element) {
    //use element
});
```

`lib.dom.queryAll` возвращает promise, чтобы асинхронно выполнить действия, если элементы найдены
```javascript
lib.dom.queryAll(".menu-item", menuElement).then(function (list) {
    //use list
});
```

`lib.dom.ready` возвращает promise, чтобы асинхронно выполнить действия после DOMContentLoaded
```javascript
lib.dom.ready().then(function () {
    //do something
});
```

##lib.date

`lib.date.isLeapYear` определяет, является ли год високосным
```javascript
lib.date.isLeapYear([date]) //→ boolean
```
где date – инстанс Date или четырехзначное число

`lib.date.monthLength` возвращает число дней в месяце, учитывая високосный год
```javascript
lib.date.monthLength(monthIndex, fullYear) //→ number
```
если вместо monthIndex передать инстанс Date, второй аргумент будет не нужен

##lib.request

`lib.request` выполняет запрос на сервер, используя XMLHttpRequest, возвращает promise
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
параметр data может быть строкой, объектом (автоматически преобразуется в query string), содержащим пары ключ-значение, или инстансом FormData

`lib.request.get` тоже самое, что lib.request, но помимо объекта с параметрами запроса, позволяет указать просто url
```javascript
lib.request.get(url) //→ promise
//или
lib.request.get(params) //→ promise
```

`lib.request.post` тоже самое, что lib.request, но позволяет не указывать метод в params

`lib.request.json` сокращение для lib.request.get(params).then(JSON.parse)

`lib.request.script` выполняет загрузку указанного скрипта, возвращает promise
```javascript
lib.request.script({
    url:     String,
    data:    String|Object,
    caching: Boolean
}) //→ promise
```
объект data автоматически преобразуется в query string

`lib.request.jsonp` тоже самое, что lib.request.script

`lib.request.toQueryParam` преобразует пару ключ-значение в query string
```javascript
lib.request.toQueryParam("chr", "ю") //→ "chr=%D1%8E"
```

`lib.request.toQueryString` преобразует объект, содержащий пары ключ-значение, в query string
```javascript
lib.request.toQueryString({
    chr1: "ю",
    chr2: "я"
}) //→ "chr1=%D1%8E&chr2=%D1%8F"
```
