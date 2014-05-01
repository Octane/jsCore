
window.addEventListener || new function () {

	function fixEvent(event) {
		var root = document.documentElement;
		event.pageX = event.clientX + root.scrollLeft;
		event.pageY = event.clientY + root.scrollTop;
		if (!event.timeStamp) {
			event.timeStamp = Date.now();
		}
		return event;
	}

	function createEventListener(callbacks, element) {
		return function (event) {
			var i = 0, length = callbacks.length, callback;
			if (!(event instanceof CustomEvent)) {
				event = fixEvent(event);
			}
			event.currentTarget = element;
			while (i < length) {
				callback = callbacks[i];
				if (callback.handleEvent) {
					callback.handleEvent(event);
				}
				else {
					callback.call(element, event);
				}
				i++;
			}
		};
	}

	function addEventListener(eventType, callback, useCapture) {
		var element = this, events, event;
		if (useCapture) {
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

	function removeEventListener(eventType, callback, useCapture) {
		var element = this, events, event, index, callbacks;
		if (useCapture) {
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
		//todo
		//return boolean;
		//The return value of dispatchEvent indicates whether any of the listeners
		//which handled the event called preventDefault.
		//If preventDefault was called the value is false, else the value is true.
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

		type: "",
		timeStamp: 0,
		detail: null,
		target: null,
		currentTarget: null,
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

		timeStamp: 0,
		currentTarget: null,
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
		var event = "CustomEvent" == group ? new CustomEvent : this.createEventObject();
		event.timeStamp = Date.now();
		return event;
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

		send: function (data) {
			this.onreadystatechange = this._onReadyStateChange;
			try {
				send.call(this, data);
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
			this.onreadystatechange = function (event) {
				if ("loaded" == this.readyState) {
					this.onreadystatechange = null;
					event = document.createEvent("CustomEvent");
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
