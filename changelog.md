#jsCore changelog

##v0.3.0

 - new: method `.getTransitionTime()` for calculate the maximum CSS transition time
 - new: methods `.addClass()`, `.removeClass()` and `.toggleClass()` for perform actions at the end of all CSS transitions
 - fix: `lib.event` API support `handleEvent`

##v0.2.0

- new: `Set()`, `Map()`, `WeakSet()` and `WeakMap()` polyfills
- new: [`handleEvent`](https://github.com/Octane/jsCore/issues/1) support in IE8
- fix: `clearImmediate()` for IE8
- fix: `.dataset` and `.classList` polyfills use [`ActiveXObject("htmlfile")`](https://github.com/es-shims/es5-shim/issues/152) in IE8
