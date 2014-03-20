﻿<img src="http://habrastorage.org/storage2/ff8/4a3/f91/ff84a3f918616a4842e66b9d40026441.png" alt="jsCore logotype" align="left">## jsCore JavaScript library<br clear="left">### Цепочки методовПостроение цепочек хоть и похоже на реализацию в jQuery, но имеет существенное отличие в том, что объект, с которым идет работа, может меняться, поэтому совершенно одинаковый код, выполнит разные действия. Приведу пример:```html<div id="example-1">example 1</div>``````javascript$("#example-1").append("h1").text("test")```Выполнив такой JavaScript-код с использованием jsCore получим:```html<div id="example-1">    <h1>test</h1></div>```А jQuery даст другой результат:```html<div id="example-1">test</div>```Так произойдет потому, что jsCore, после добавления `<h1>`, в отличие от jQuery, переключится на новый элемент и добавит в него текст `test`, а jQuery, добавив `<h1>`, тут же заменит его на текстовый узел `test`, продолжив работать с начальным элементом `<div id="example-1">`.### Действия для коллекции и одного элементаjQuery всегда работает с коллекцией элементов, даже если точно известно, что элемент один. Эта особенность часто затрудняет отладку, например:```javascript$("#example-2").addClass("active")```В случае отсутствия элемента `#example-2`, не произойдет никакой ошибки, цикл конечно же не выполнить ни одной итерации по пустой коллекции, и метод `addClass` ни разу не будет вызван, а хотелось бы получить в консоли сообщение о том, что какое-то внутреннее свойство `null`, как это происходит без использования библиотеки:```javascriptvar node = document.getElementById("#example-2");node.classList.add("active") //TypeError: node is null```Мне приходилось встречать в кодах коллег забытые цепочки, которые ничего не выполняли, для них больше не существовало DOM-элементов… Еще одним моментом, вызывающим неудобства при использовании jQuery и вытекающим из первой проблемы, является то, что не видя селектор, по коду сложно определить для какого количества элементов он написан.В jsCore я постараюсь избавиться от этих проблем, уйдя от погони за супер-универсальностью функции `$` и разделив методы для работы с одним элементом и коллекцией. Будет две глобальных функции, возвращающих обёртки с разными прототипами:```javascript$(".example-3") // -> {src: document.querySelector(".example-3")}    .addClass(...)    .append(...)    .hide(...)    ...$$(".example-3") // -> {src: document.querySelectorAll(".example-3")}    .filter(...)    .each(...)    .odd(...)    ...```Для коллекции узлов будет доступен метод `each`, который первым параметром сможет принимать название метода, например:```javascript$$(".example-3").each("addClass", "active")```Таким образом метод `addClass` будет вызван для каждого элемента коллекции. Тот факт, что работа идет несколькими элементами, будет наглядно продемонстрирована использованием метода `each`.Один элемент:```javascript$(".example-3").addClass("active");```Коллекция элементов:```javascript$$(".example-3").each("addClass", "active");```