#jsCore changelog

##v0.4.0

 - new: methods `.get()` and `.set()` for CSS properties
 - new: `.cssFloat` and `.getPropertyValue()` for `CSSStyleDeclaration` in IE8

##v0.3.0

 - new: prefixed transition and animation event types
 - new: prefixed transition and animation property names
 - new: method `.prefix()` for CSS properties
 - new: method `.getTransitionTime()` for calculate the maximum CSS transition time
 - new: methods `.awaitAnimationEnd()`, `.awaitTransitionEnd()` and `.awaitTransAnimEnd()`
 - new: methods `.addClass()`, `.removeClass()` and `.toggleClass()` for perform actions at the end of all CSS transitions and animations
 - fix: `lib.event` API support `handleEvent`
 - fix: `Promise` polyfill behavior (call a `resolver` when the `promise` is created)

##v0.2.0

- new: `Set()`, `Map()`, `WeakSet()` and `WeakMap()` polyfills
- new: [`handleEvent`](https://github.com/Octane/jsCore/issues/1) support in IE8
- fix: `clearImmediate()` for IE8
- fix: `.dataset` and `.classList` polyfills use [`ActiveXObject("htmlfile")`](https://github.com/es-shims/es5-shim/issues/152) in IE8
