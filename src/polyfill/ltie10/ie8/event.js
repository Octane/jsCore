
window.addEventListener || new function () {

    var eventReplacements = {
            DOMContentLoaded: {
                eventType: 'readystatechange',
                decorateListener: function (listener) {
                    return function (event) {
                        if ('complete' == document.readyState) {
                            listener(event);
                        }
                    };
                }
            }
        };

    function fixEvent(event) {
        var root = document.documentElement;
        event.pageX = event.clientX + root.scrollLeft;
        event.pageY = event.clientY + root.scrollTop;
        if (!event.timeStamp) {
            event.timeStamp = Date.now();
        }
    }

    function createEventListener(callbacks, element) {
        return function (event) {
            var callback,
                list = callbacks.slice(0),
                length = list.length,
                i = 0;
            if (!(event instanceof CustomEvent)) {
                fixEvent(event);
            }
            event.currentTarget = element;
            while (i < length) {
                callback = list[i];
                if (callback.handleEvent) {
                    callback.handleEvent(event);
                } else {
                    callback.call(element, event);
                }
                i++;
            }
        };
    }

    function addEventListener(eventType, callback, useCapture) {
        var element = this,
            listener,
            events,
            event,
            fix;
        if (useCapture) {
            throw new Error('Capturing phase is not supported');
        }
        if (!element._events) {
            element._events = {};
        }
        events = element._events;
        fix = eventReplacements[eventType];
        if (fix) {
            eventType = fix.eventType;
        }
        event = events[eventType];
        if (!event) {
            event = {
                callbacks: []
            };
            listener = createEventListener(event.callbacks, element);
            if (fix) {
                listener = fix.decorateListener(listener);
            }
            event.listener = listener;
            events[eventType] = event;
            this.attachEvent('on' + eventType, listener);
        }
        if (-1 == event.callbacks.indexOf(callback)) {
            event.callbacks.push(callback);
        }
    }

    function removeEventListener(eventType, callback, useCapture) {
        var element = this,
            callbacks,
            events,
            event,
            index,
            fix;
        if (useCapture) {
            throw new Error('Capturing phase is not supported');
        }
        if (!element._events) {
            return;
        }
        events = element._events;
        fix = eventReplacements[eventType];
        if (fix) {
            eventType = fix.eventType;
        }
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
            element.detachEvent('on' + eventType, event.listener);
            delete events[eventType];
        }
    }

    function dispatchEvent(event) {
        var eventType = event.type,
            events,
            fix;
        if (event instanceof CustomEvent) {
            event.target = this;
            events = this._events;
            if (events && events[eventType]) {
                events[eventType].listener(event);
            }
        } else {
            fix = eventReplacements[eventType];
            if (fix) {
                eventType = fix.eventType;
            }
            this.fireEvent('on' + eventType, event);
        }
        return !event.defaultPrevented;
    }

    function initEvent(type, bubbles, cancelable) {
        Object.assign(this, {
            type: type,
            bubbles: bubbles,
            cancelable: cancelable
        });
    }

    function initUIEvent(type, bubbles, cancelable, view, detail) {
        this.initEvent(type, bubbles, cancelable);
        Object.assign(this, {
            view: view,
            detail: detail
        });
    }

    function initMouseEvent(type, bubbles, cancelable, view, detail, screenX,
                            screenY, clientX, clientY, ctrlKey, altKey,
                            shiftKey, metaKey, button, relatedTarget) {
        this.initUIEvent(type, bubbles, cancelable, view, detail);
        Object.assign(this, {
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

        type: '',
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
        initEvent: initEvent

    });

    Object.defineProperty(Event.prototype, 'target', {
        get: function () {
            return this.srcElement;
        }
    });

    Object.defineProperty(Event.prototype, 'relatedTarget', {
        get: function () {
            if (this.fromElement === this.srcElement) {
                return this.toElement;
            }
            return this.fromElement;
        }
    });

    [HTMLElement, HTMLDocument, Window, XMLHttpRequest].
        forEach(function (eventTarget) {
            var proto = eventTarget.prototype;
            proto.dispatchEvent = dispatchEvent;
            proto.addEventListener = addEventListener;
            proto.removeEventListener = removeEventListener;
        });

    HTMLDocument.prototype.createEvent = function (group) {
        var event;
        if (group.startsWith('CustomEvent')) {
            event = new CustomEvent;
        } else {
            event = this.createEventObject();
            if (group.startsWith('UIEvent')) {
                event.initUIEvent = initUIEvent;
            } else if (group.startsWith('MouseEvent')) {
                event.initUIEvent = initUIEvent;
                event.initMouseEvent = initMouseEvent;
            }
        }
        event.timeStamp = Date.now();
        return event;
    };

};

'onload' in new XMLHttpRequest || new function () {

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
            var event = document.createEvent('CustomEvent');
            event.initEvent(eventType, false, false);
            this.dispatchEvent(event);
            eventType = 'on' + eventType;
            if (this[eventType]) {
                window.setImmediate(function () {
                    event.target[eventType](event);
                });
            }
        },

        _onReadyStateChange: function () {
            if (this.readyState == this.DONE) {
                this._unbind();
                this._fireEvent('load');
            }
        },

        open: function () {
            try {
                open.apply(this, arguments);
            } catch (error) {
                this._unbind();
                this._fireEvent('error');
            }
        },

        send: function (data) {
            this.onreadystatechange = this._onReadyStateChange;
            try {
                send.call(this, data);
            } catch (error) {
                this._unbind();
                this._fireEvent('error');
            }
        },

        abort: function () {
            abort.call(this);
            this._fireEvent('abort');
        }

    });

};

'onload' in document.createElement('script') ||
Object.defineProperty(HTMLScriptElement.prototype, 'onload', {

    //Warning: don't use onreadystatechange with onload and onerror!

    set: function (callback) {
        if ('function' == typeof callback) {
            this.onreadystatechange = function (event) {
                if ('loaded' == this.readyState) {
                    this.onreadystatechange = null;
                    event = document.createEvent('CustomEvent');
                    if (this.text) {
                        event.initEvent('load', false, false);
                        callback.call(this, event);
                    } else if (this.onerror) {
                        event.initEvent('error', false, false);
                        this.onerror(event);
                    }
                    this.onerror = null;
                }
            };
        } else {
            this.onreadystatechange = null;
        }
    }

});
