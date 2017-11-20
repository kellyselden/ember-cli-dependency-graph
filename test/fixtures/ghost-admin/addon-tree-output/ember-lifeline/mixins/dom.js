define('ember-lifeline/mixins/dom', ['exports', 'ember'], function (exports, _ember) {
  exports.setShouldAssertPassive = setShouldAssertPassive;
  var Mixin = _ember['default'].Mixin;
  var $ = _ember['default'].$;
  var run = _ember['default'].run;
  var merge = _ember['default'].merge;
  var assert = _ember['default'].assert;

  var DEFAULT_LISTENER_OPTIONS = {
    passive: true
  };

  var shouldAssertPassive = false;

  function setShouldAssertPassive(value) {
    shouldAssertPassive = value && window.Proxy;
  }

  function assertOnlyPassiveEventUsageProxy(event) {
    return new window.Proxy(event, {
      get: function get(obj, prop) {
        if (prop === 'preventDefault') {
          throw new Error('Passive event listeners cannot call preventDefault, please pass `{passive: false}`');
        }
        if (prop === 'stopPropagation') {
          throw new Error('Passive event listeners cannot call stopPropagation, please pass `{passive: false}`');
        }
        return obj[prop];
      }
    });
  }

  function listenerDataFor(element, eventName) {
    var passiveListeners = element.prop('_passiveListeners');
    /* Set an object to cache passive listener data */
    if (!passiveListeners) {
      passiveListeners = {};
      element.prop('_passiveListeners', passiveListeners);
    }

    var passiveListenersForEvent = passiveListeners[eventName];
    /* Set an object for the event */
    if (!passiveListenersForEvent) {
      passiveListenersForEvent = {
        handlers: [],
        listener: null
      };
      passiveListeners[eventName] = passiveListenersForEvent;
    }

    return passiveListenersForEvent;
  }

  function removeHandlerFromListenerData(handler) {
    var listenerData = listenerDataFor(handler.element, handler.eventName);

    /*
     * Splice the handler out of the handlers list
     */
    var index = listenerData.handlers.indexOf(handler.callback);
    listenerData.handlers.splice(index, 1);

    /*
     * If no more handlers remain, detach the passive listener from the
     * element and reset the listenerData cache.
     */
    if (listenerData.handlers.length === 0) {
      handler.element.off(handler.eventName, listenerData.listener);
      listenerData.listener = null;
      listenerData.handlers = [];
    }
  }

  /**
   ContextBoundEventListenersMixin provides a mechanism to attach event listeners
   with runloops and automatic removal when the host object is removed from DOM.
  
   These capabilities are very commonly needed, so this mixin is by default
   included into all `Ember.View` and `Ember.Component` instances.
  
   @class ContextBoundEventListenersMixin
   @public
   */
  exports['default'] = Mixin.create({
    init: function init() {
      this._super.apply(this, arguments);

      this._listeners = undefined;
      this._coalescedHandlers = undefined;
    },
    /**
     Attaches an event listener that will automatically be removed when the host
     object is dropped from DOM.
      Example:
      ```js
     import Component from 'ember-component';
     import ContextBoundEventListenersMixin from 'ember-lifeline/mixins/dom';
      export default Component.extend(ContextBoundEventListenersMixin, {
       didInsertElement() {
         this.addEventListener('.some-item', 'click', (e) => {
           console.log('.some-item was clicked');
         });
       }
     });
     ```
      @method addEventListener
     @param { String } selector the jQuery selector or element
     @param { String } _eventName the event name to listen for
     @param { Function } _callback the callback to run for that event
     @public
     */
    addEventListener: function addEventListener(selector, eventName, callback, _options) {
      assert('Must provide an element (not a jQuery selector) when using addEventListener in a tagless component.', this.tagName !== '' || typeof selector !== 'string');
      assert('Called addEventListener before the component was rendered', this._currentState === this._states.inDOM);

      // Ember.assign would be better here, but Ember < 2.5 doesn't have that :(
      var options = merge(merge({}, DEFAULT_LISTENER_OPTIONS), _options);
      var element = findElement(this.element, selector);

      if (options.passive) {
        this._addCoalescedEventListener(element, eventName, callback);
      } else {
        this._addEventListener(element, eventName, callback);
      }
    },

    /**
      @param { String } selector the jQuery selector or element
     @param { String } _eventName the event name to listen for
     @param { Function } _callback the callback to run for that event
     @public
     */
    removeEventListener: function removeEventListener(selector, eventName, callback, _options) {
      assert('Must provide an element (not a jQuery selector) when using addEventListener in a tagless component.', this.tagName !== '' || typeof selector !== 'string');

      var options = merge(merge({}, DEFAULT_LISTENER_OPTIONS), _options);
      var element = findElement(this.element, selector);

      if (options.passive) {
        this._removeCoalescedEventListener(element, eventName, callback);
      } else {
        this._removeEventListener(element, eventName, callback);
      }
    },

    _addCoalescedEventListener: function _addCoalescedEventListener(element, eventName, _callback) {
      var _this = this;

      var callback = run.bind(this, _callback);
      /*
       * listenerData caches the handler list and listener callback on the
       * element as a property.
       */
      var listenerData = listenerDataFor(element, eventName);

      /*
       * If listenerData has no handlers, we must setup the listener.
       */
      if (listenerData.handlers.length === 0) {

        /*
         * Create a callback that walks over all handlers and calls them in
         * order. In dev mode, wrap the event in a proxy to ensure active
         * steps like stopPropogation or preventDefault are not called.
         */
        var coalescedCallback = function coalescedCallback(event) {
          for (var _len = arguments.length, callbackArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            callbackArgs[_key - 1] = arguments[_key];
          }

          var eventForHandlers = event;
          if (shouldAssertPassive) {
            eventForHandlers = assertOnlyPassiveEventUsageProxy(event);
          }

          run(function () {
            listenerData.handlers.forEach(function (h) {
              h.apply(_this, [eventForHandlers].concat(callbackArgs));
            });
          });
        };

        /*
         * Attach the listener and cache the listener for teardown
         */
        element.on(eventName, coalescedCallback);
        listenerData.listener = coalescedCallback;
      }

      /*
       * Finally, push the handler onto the list of handlers. Do this on the
       * listenerData for execution of the hooks, and on the context for
       * teardown.
       */
      listenerData.handlers.push(callback);

      this._getOrAllocateArray('_coalescedHandlers').push({ element: element, eventName: eventName, callback: callback, _callback: _callback });
    },

    _addEventListener: function _addEventListener(element, eventName, _callback) {
      var callback = run.bind(this, _callback);
      element.on(eventName, callback);
      this._getOrAllocateArray('_listeners').push({ element: element, eventName: eventName, callback: callback, _callback: _callback });
    },

    _removeCoalescedEventListener: function _removeCoalescedEventListener(element, eventName, _callback) {
      if (!this._coalescedHandlers) {
        return;
      }

      for (var i = 0; i < this._coalescedHandlers.length; i++) {
        var handler = this._coalescedHandlers[i];
        if (handler.element.get(0) === element.get(0) && handler.eventName === eventName && handler._callback === _callback) {
          removeHandlerFromListenerData(handler);
          break;
        }
      }
    },

    _removeEventListener: function _removeEventListener(element, eventName, _callback) {
      if (!this._listeners) {
        return;
      }

      // We cannot use Array.findIndex as we cannot rely on babel/polyfill being present
      for (var i = 0; i < this._listeners.length; i++) {
        var listener = this._listeners[i];
        if (listener.element.get(0) === element.get(0) && listener.eventName === eventName && listener._callback === _callback) {
          /*
           * Drop the event listener and remove the listener object
           */
          element.off(eventName, listener.callback);
          this._listeners.splice(i, 1);
          break;
        }
      }
    },

    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);

      if (this._listeners) {
        /* Drop non-passive event listeners */
        for (var i = 0; i < this._listeners.length; i++) {
          var _listeners$i = this._listeners[i];
          var element = _listeners$i.element;
          var eventName = _listeners$i.eventName;
          var callback = _listeners$i.callback;

          element.off(eventName, callback);
        }
        this._listeners.length = 0;
      }

      if (this._coalescedHandlers) {
        /* Drop passive event listeners */
        for (var i = 0; i < this._coalescedHandlers.length; i++) {
          var handler = this._coalescedHandlers[i];
          removeHandlerFromListenerData(handler);
        }
        this._coalescedHandlers.length = 0;
      }
    },

    _getOrAllocateArray: function _getOrAllocateArray(propertyName) {
      if (!this[propertyName]) {
        this[propertyName] = [];
      }

      return this[propertyName];
    }
  });

  function findElement(contextElement, selector) {
    var selectorType = typeof selector;
    var element = undefined;
    if (selectorType === 'string') {
      element = $(selector, contextElement);
    } else if (selector instanceof $) {
      element = selector;
    } else if (selector.nodeType || selector === window) {
      element = $(selector);
    }

    assert('Called addEventListener with bad selector value ' + selector, !!element);
    assert('Called addEventListener with selector not found in DOM: ' + selector, element.length > 0);

    return element;
  }
});