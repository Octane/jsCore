#jsCore changelog

##v0.7.0

 - `lib.Template()` now returns a function

##v0.6.1

 - fix: `.find()` and `.findIndex()` no longer ignore array element holes
 - fix: `Object.assign()` ignores null and undefined source arguments
 - new: `.request({advanced: function (xhr) {…}})`
 - del: `.addEventListener()`, `.removeEventListener()` and `.dispatchEvent()` from polyfill for XMLHttpRequest (IE8)

##v0.6.0

 - new: `Array.prototype.contains()` polyfill
 - del: `lib.contains()`

##v0.5.1

 - wontfix [bug 2435](https://bugs.ecmascript.org/show_bug.cgi?id=2435)

##v0.5.0

 - del: `.query()` and `.queryAll()` methods ([excluded from the W3C DOM 4 editor's draft](https://github.com/w3c/dom/commit/26355318c1013ea13c9d209665d14d2c13e28827))

##v0.4.9

 - upd: `Promise()` polyfill (fix [#2](https://github.com/Octane/Promise/issues/2), [#6](https://github.com/Octane/Promise/pull/6), [#7](https://github.com/Octane/Promise/issues/7), [#8](https://github.com/Octane/Promise/issues/8))

##v0.4.8

 - fix: set `.relatedTarget` only for `mouseover` and `mouseout`

##v0.4.7

 - new: `lib.cookie` utils
 - new: `Object.setPrototypeOf` polyfill

##v0.4.6

 - many `Promise` [fixes](https://github.com/Octane/Promise/releases)

##v0.4.5

 - fix: an animation event propagation bug in `.awaitAnimationEnd()` (listen only the `AT_TARGET` phase)

##v0.4.4

 - fix: remove a global variable `error` (`catch(error)` in the global scope)
 - fix: define a variable `fileName` in `FormData()` polyfill when necessary
 - new: a builder

##v0.4.3

 - fix: a bug with negative `endIndex` in `Array.prototype.fill` polyfill
 - fix: define `.setImmediate()` once
 - fix: `lib` methods don't depend on the activation object (`this`)
 - fix: support `DOMContentLoaded` in IE8
 - del: `.catch_()` and `.delete_()` aliases, use the brackets notation in IE8

##v0.4.2

 - del: `.initKeyEvent()` and `.initMutationEvent()`
 - fix: `.dispatchEvent()` must return a value
 - fix: a bug in `.stopPropagation()`
 - fix: `.getComputedStyle(el).animationName` may be equal to `"none, none, …"` in IE11

##v0.4.1

- fix: `.setImmediate()` polyfill uses `.msSetImmediate()` in IE10
- simplify `EventTarget()` and `.setImmediate()` polyfills
- optimize `lib.css.set()`

##v0.4.0

 - new: `.get()` and `.set()` for CSS properties
 - new: `CSSStyleDeclaration()` polyfill
 - new: `opacity` in computed style
 - del: `lib.dom.query()` and `lib.dom.queryAll()`
 - rename `lib.class._extend()` to `lib.classExtends()`
 - simplify `lib.request()` code

##v0.3.0

 - new: prefixed transition and animation event types
 - new: prefixed transition and animation property names
 - new: a method `.prefix()` for the CSS properties
 - new: a method `.getTransitionTime()` for calculate the maximum CSS transition time
 - new: methods `.awaitAnimationEnd()`, `.awaitTransitionEnd()` and `.awaitTransAnimEnd()`
 - new: methods `.addClass()`, `.removeClass()` and `.toggleClass()` for perform actions at the end of all CSS transitions and animations
 - fix: `lib.event` API support `handleEvent`
 - fix: `Promise()` polyfill behavior (call a `resolver` when the `promise` is created)

##v0.2.0

 - new: `Set()`, `Map()`, `WeakSet()` and `WeakMap()` polyfills
 - new: [`handleEvent`](https://github.com/Octane/jsCore/issues/1) support in IE8
 - fix: `.clearImmediate()` for IE8
 - fix: `.dataset` and `.classList` polyfills use [`ActiveXObject('htmlfile')`](https://github.com/es-shims/es5-shim/issues/152) in IE8
