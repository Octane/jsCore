
'head' in document || Object.defineProperty(document, 'head', {
    get: function () {
        return document.querySelector('head');
    }
});
