#jsCore changelog

##v0.4.2

 - remove `.initKeyEvent()` and `.initMutationEvent()`
 - fix: `.dispatchEvent()` must return a value
 - fix: bug in `.stopPropagation()`

##v0.4.1

- fix: `.setImmediate()` polyfill uses `.msSetImmediate()` in IE10
- simplify `EventTarget()` and `.setImmediate()` polyfills
- optimize `lib.css.set()`

##v0.4.0

 - new: `.get()` and `.set()` for CSS properties
 - new: `CSSStyleDeclaration()` polyfill
 - new: `opacity` in computed style
 - rename `lib.class._extend()` to `lib.classExtends()`
 - delete `lib.dom.query()` and `lib.dom.queryAll()`
 - simplify `lib.request()` code

##v0.3.0

 - new: prefixed transition and animation event types
 - new: prefixed transition and animation property names
 - new: method `.prefix()` for CSS properties
 - new: method `.getTransitionTime()` for calculate the maximum CSS transition time
 - new: methods `.awaitAnimationEnd()`, `.awaitTransitionEnd()` and `.awaitTransAnimEnd()`
 - new: methods `.addClass()`, `.removeClass()` and `.toggleClass()` for perform actions at the end of all CSS transitions and animations
 - fix: `lib.event` API support `handleEvent`
 - fix: `Promise()` polyfill behavior (call a `resolver` when the `promise` is created)

##v0.2.0

 - new: `Set()`, `Map()`, `WeakSet()` and `WeakMap()` polyfills
 - new: [`handleEvent`](https://github.com/Octane/jsCore/issues/1) support in IE8
 - fix: `clearImmediate()` for IE8
 - fix: `.dataset` and `.classList` polyfills use [`ActiveXObject("htmlfile")`](https://github.com/es-shims/es5-shim/issues/152) in IE8
