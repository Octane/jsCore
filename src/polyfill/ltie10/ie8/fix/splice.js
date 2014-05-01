
//IE8 Array.splice fix
//http://javascript.ru/forum/307534-post71.html
(function () {
    var iterable = {
        0: true,
        length: 1
    };
    Array.splice(iterable, 0, 1);
    return iterable[0]; //→ true in IE8
}()) && new function () {
    var splice = Array.splice;
    Array.splice = function (iterable, start, deleteCount) {
        var deltedItems = splice.apply(Array, arguments), length;
        if (!(iterable instanceof Array)) {
            length = iterable.length;
            while (deleteCount--) {
                delete iterable[length + deleteCount];
            }
        }
        return deltedItems;
    };
};
