#jsCore changelog

##v0.3.0

 - new: `lib.dom.getTransitionTime(element) → ms`
 - new: `lib.dom.addClass(class[, class1[, class2[, …]]], element) → promise`
 - new: `lib.dom.removeClass(class[, class1[, class2[, …]]], element) → promise`
 - new: `lib.dom.toggleClass(class[, class1[, class2[, …]]], element) → promise`
 - …

##v0.2.0

- new: `Set`, `Map`, `WeakSet`, `WeakMap` polyfills
- new: [`handleEvent`](https://github.com/Octane/jsCore/issues/1) support in IE8
- fix: `clearImmediate` for IE8
- fix: `dataset` and `classList` polyfills use [`ActiveXObject("htmlfile")`](https://github.com/es-shims/es5-shim/issues/152) in IE8
