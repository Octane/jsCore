
window.addEventListener || new function () {

	function fastBind(func, boundThis) {
		if (func.handleEvent) {
			boundThis = func;
			func = func.handleEvent;
		}
		return function (arg) {
			func.call(boundThis, arg);
		};
	}

	function fixEvent(event) {
		var clone = document.createEventObject(event),
			docEl = document.documentElement;
		clone.pageX = clone.clientX + docEl.scrollLeft;
		clone.pageY = clone.clientY + docEl.scrollTop;
		return clone;
	}

	function createEventListener(callbacks, element) {
		return function (event) {
			var i = 0, length = callbacks.length;
			if (!(event instanceof CustomEvent)) {
				event = fixEvent(event);
			}
			event.currentTarget = element;
			while (i < length) {
				window.setImmediate(fastBind(callbacks[i], element), event);
				i++;
			}
		};
	}

	function addEventListener(eventType, callback, useCapturing) {
		var element = this, events, event;
		if (useCapturing) {
			throw new Error("Capturing phase is not supported");
		}
		if (!element._events) {
			element._events = {};
		}
		events = element._events;
		event = events[eventType];
		if (!event) {
			event = {
				callbacks: []
			};
			event.listener = createEventListener(event.callbacks, element);
			events[eventType] = event;
			this.attachEvent("on" + eventType, event.listener);
		}
		if (-1 == event.callbacks.indexOf(callback)) {
			event.callbacks.push(callback);
		}
	}

	function removeEventListener(eventType, callback, useCapturing) {
		var element = this, events, event, index, callbacks;
		if (useCapturing) {
			throw new Error("Capturing phase is not supported");
		}
		if (!element._events) {
			return;
		}
		events = element._events;
		if (!events[eventType]) {
			return;
		}
		event = events[eventType];
		callbacks = event.callbacks;
		index = callbacks.indexOf(callback);
		if (-1 == index) {
			return;
		}
		callbacks.splice(index, 1);
		if (!callbacks.length) {
			element.detachEvent("on" + eventType, event.listener);
			delete events[eventType];
		}
	}

	function dispatchEvent(event) {
		var events;
		if (event instanceof CustomEvent) {
			event.target = this;
			events = this._events;
			if (events && events[event.type]) {
				events[event.type].listener(event);
			}
		}
		else {
			this.fireEvent("on" + event.type, event);
		}
	}

	function initEvent(type, bubbles, cancelable) {
		Object.assign(this, {
			type: type,
			bubbles: bubbles,
			cancelable: cancelable
		});
	}

	function preventDefault() {
		this.defaultPrevented = true;
		this.returnValue = false;
	}

	function stopPropagation() {
		this.cancelBubble = true;
	}

	function CustomEvent() {}

	Object.assign(CustomEvent.prototype, {

		defaultPrevented: false,

		preventDefault: preventDefault,
		stopPropagation: stopPropagation,

		initEvent: initEvent,

		initCustomEvent: function (type, bubbles, cancelable, detail) {
			this.initEvent(type, bubbles, cancelable);
			this.detail = detail;
		}

	});

	Object.assign(Event.prototype, {

		defaultPrevented: false,

		preventDefault: preventDefault,
		stopPropagation: stopPropagation,

		initEvent: initEvent,

		initUIEvent: function (type, bubbles, cancelable, windowObject, detail) {
			this.initEvent(type, bubbles, cancelable);
			Object.assign(this, {
				windowObject: windowObject,
				detail: detail
			});
		},

		initKeyEvent: function (type, bubbles, cancelable, windowObject, ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode) {
			this.initEvent(type, bubbles, cancelable);
			Object.assign(this, {
				windowObject: windowObject,
				ctrlKey: ctrlKey,
				altKey: altKey,
				shiftKey: shiftKey,
				metaKey: metaKey,
				keyCode: keyCode,
				charCode: charCode
			});
		},

		initMouseEvent: function (type, bubbles, cancelable, windowObject, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) {
			this.initEvent(type, bubbles, cancelable);
			Object.assign(this, {
				windowObject: windowObject,
				detail: detail,
				screenX: screenX,
				screenY: screenY,
				clientX: clientX,
				clientY: clientY,
				ctrlKey: ctrlKey,
				altKey: altKey,
				shiftKey: shiftKey,
				metaKey: metaKey,
				button: button,
				fromElement: relatedTarget
			});
		},

		initMutationEvent: function (type, bubbles, cancelable, relatedNode, prevValue, newValue, attrName, attrChange) {
			this.initEvent(type, bubbles, cancelable);
			Object.assign(this, {
				relatedNode: relatedNode,
				prevValue: prevValue,
				newValue: newValue,
				attrName: attrName,
				attrChange: attrChange
			});
		}

	});

	Object.defineProperty(Event.prototype, "target", {
		get: function () {
			return this.srcElement;
		}
	});

	Object.defineProperty(Event.prototype, "relatedTarget", {
		get: function () {
			return this.fromElement === this.target ? this.toElement : this.fromElement;
		}
	});

	[Window, HTMLDocument, HTMLElement, XMLHttpRequest].forEach(function (eventTarget) {
		var proto = eventTarget.prototype;
		proto.dispatchEvent = dispatchEvent;
		proto.addEventListener = addEventListener;
		proto.removeEventListener = removeEventListener;
	});

	HTMLDocument.prototype.createEvent = function (group) {
		if ("CustomEvent" == group) {
			return new CustomEvent;
		}
		return this.createEventObject();
	};

};

"onload" in new XMLHttpRequest || new function () {

	var proto = XMLHttpRequest.prototype,
		abort = proto.abort,
		send = proto.send,
		open = proto.open;

	Object.assign(proto, {

		UNSENT: 0,
		OPENED: 1,
		HEADERS_RECEIVED: 2,
		LOADING: 3,
		DONE: 4,

		_unbind: function () {
			this.onreadystatechange = null;
		},

		_fireEvent: function (eventType) {
			var event = document.createEvent("CustomEvent");
			event.initEvent(eventType, false, false);
			this.dispatchEvent(event);
			eventType = "on" + eventType;
			if (this[eventType]) {
				window.setImmediate(function () {
					event.target[eventType](event);
				});
			}
		},

		_onReadyStateChange: function () {
			if (this.readyState == this.DONE) {
				this._unbind();
				this._fireEvent("load");
			}
		},

		open: function () {
			try {
				open.apply(this, arguments);
			}
			catch (error) {
				this._unbind();
				this._fireEvent("error");
			}
		},

		send: function () {
			this.onreadystatechange = this._onReadyStateChange;
			try {
				send.apply(this, arguments);
			}
			catch (error) {
				this._unbind();
				this._fireEvent("error");
			}
		},

		abort: function () {
			abort.call(this);
			this._fireEvent("abort");
		}

	});

};

"onload" in document.createElement("script") || Object.defineProperty(HTMLScriptElement.prototype, "onload", {

	//Warning: don't use onreadystatechange with onload and onerror!

	set: function (callback) {
		if ("function" == typeof callback) {
			this.onreadystatechange = function () {
				var event;
				if ("loaded" == this.readyState) {
					this.onreadystatechange = null;
					event = document.createEvent("Event");
					if (this.text) {
						event.initEvent("load", false, false);
						callback.call(this, event);
					}
					else if (this.onerror) {
						event.initEvent("error", false, false);
						this.onerror(event);
					}
					this.onerror = null;
				}
			};
		}
		else {
			this.onreadystatechange = null;
		}
	}

});
