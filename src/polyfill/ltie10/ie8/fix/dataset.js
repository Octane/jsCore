
//IE8 dataset polyfill fix
new function () {
    try {
        Object.defineProperty({}, 'test', {});
    }
    catch (error) {
        window.StaticDOMStringMap = new function () {
            //github.com/es-shims/es5-shim/issues/152
            var uid = 0,
                fakeDoc = new ActiveXObject('htmlfile'),
                proto = createObject().constructor.prototype;
            function createObject() {
                return fakeDoc.getElementsByName(uid++);
            }
            Object.keys(proto).forEach(function (key) {
                proto[key] = undefined;
            });
            proto = null;
            return createObject;
        };
    }
};
