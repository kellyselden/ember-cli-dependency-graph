define('ember-lifeline/mixins/run', ['exports', 'ember'], function (exports, _ember) {
  exports.setShouldPoll = setShouldPoll;
  exports.pollTaskFor = pollTaskFor;
  var Mixin = _ember['default'].Mixin;
  var run = _ember['default'].run;
  var assert = _ember['default'].assert;

  var _shouldPollOverride = undefined;
  function shouldPoll() {
    if (_shouldPollOverride) {
      return _shouldPollOverride();
    }

    // eslint-disable-next-line ember-suave/no-direct-property-access
    return !_ember['default'].testing;
  }

  function setShouldPoll(callback) {
    _shouldPollOverride = callback;
  }

  var queuedPollTasks = {};
  var pollTaskLabels = {};

  function pollTaskFor(label) {
    assert('A pollTask with a label of \'' + label + '\' was not found.', pollTaskLabels[label]);
    assert('You cannot advance a pollTask (`' + label + '`) when `next` has not been called.', !!queuedPollTasks[label]);

    return run.join(null, queuedPollTasks[label]);
  }

  /**
   ContextBoundTasksMixin provides a mechanism to run tasks (ala `setTimeout` or
   `Ember.run.later`) with automatic cancellation when the host object is
   destroyed.
  
   These capabilities are very commonly needed, so this mixin is by default
   included into all `Ember.View`, `Ember.Component`, and `Ember.Service` instances.
  
   @class ContextBoundTasksMixin
   @public
   */
  exports['default'] = Mixin.create({
    init: function init() {
      this._super.apply(this, arguments);

      this._pendingTimers = undefined;
      this._pendingDebounces = undefined;
      this._pollerLabels = undefined;
    },

    /**
     Runs the provided function at the specified timeout (defaulting to 0).
     The timer is properly canceled if the object is destroyed before it is invoked.
      Example:
      ```js
     import Component from 'ember-component';
     import ContextBoundTasksMixin from 'ember-lifeline/mixins/run';
      export default Component.extend(ContextBoundTasksMixin, {
       didInsertElement() {
         this.runTask(() => {
           console.log('This runs after 5 seconds if this component is still displayed');
         }, 5000)
       }
     });
     ```
      @method runTask
     @param { Function } callback the callback to run at the provided time
     @param { Number } [timeout=0] the time in the future to run the callback
     @public
     */
    runTask: function runTask(callbackOrName) {
      var _this = this;

      var timeout = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      assert('Called `runTask` on destroyed object: ' + this + '.', !this.isDestroyed);

      var type = typeof callbackOrName;
      var pendingTimers = this._getOrAllocateArray('_pendingTimers');

      var cancelId = run.later(function () {
        var cancelIndex = pendingTimers.indexOf(cancelId);
        pendingTimers.splice(cancelIndex, 1);

        if (type === 'function') {
          callbackOrName.call(_this);
        } else if (type === 'string' && _this[callbackOrName]) {
          _this[callbackOrName]();
        } else {
          throw new Error('You must pass a callback function or method name to `runTask`.');
        }
      }, timeout);

      pendingTimers.push(cancelId);
      return cancelId;
    },

    /**
     Cancel a previously scheduled task.
      Example:
      ```js
     import Component from 'ember-component';
     import ContextBoundTasksMixin from 'ember-lifeline/mixins/run';
      export default Component.extend(ContextBoundTasksMixin, {
       didInsertElement() {
         this._cancelId = this.runTask(() => {
           console.log('This runs after 5 seconds if this component is still displayed');
         }, 5000)
       },
        disable() {
          this.cancelTask(this._cancelId);
       }
     });
     ```
      @method cancelTask
     @param { Number } cancelId the id returned from the runTask call
     @public
     */
    cancelTask: function cancelTask(cancelId) {
      cancelTimer(cancelId);
    },

    /**
     Runs the function with the provided name after the timeout has expired on the last
     invocation. The timer is properly canceled if the object is destroyed before it is
     invoked.
      Example:
      ```js
     import Component from 'ember-component';
     import ContextBoundTasksMixin from 'ember-lifeline/mixins/run';
      export default Component.extend(ContextBoundTasksMixin, {
       logMe() {
         console.log('This will only run once every 300ms.');
       },
        click() {
         this.debounceTask('logMe', 300);
       }
     });
     ```
      @method debounceTask
     @param { String } methodName the name of the method to debounce
     @param { ...* } debounceArgs arguments to pass to the debounced method
     @param { Number } wait the amount of time to wait before calling the method (in milliseconds)
     @public
     */
    debounceTask: function debounceTask(name) {
      var _this2 = this;

      assert('Called `debounceTask` without a string as the first argument on ' + this + '.', typeof name === 'string');
      assert('Called `this.debounceTask(\'' + name + '\', ...)` where \'this.' + name + '\' is not a function.', typeof this[name] === 'function');
      assert('Called `debounceTask` on destroyed object: ' + this + '.', !this.isDestroyed);

      var pendingDebounces = this._getOrAllocateObject('_pendingDebounces');
      var debounce = pendingDebounces[name];
      var debouncedFn = undefined;

      if (!debounce) {
        debouncedFn = function () {
          delete pendingDebounces[name];
          _this2[name].apply(_this2, arguments);
        };
      } else {
        debouncedFn = debounce.debouncedFn;
      }

      // cancelId is new, even if the debounced function was already present

      for (var _len = arguments.length, debounceArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        debounceArgs[_key - 1] = arguments[_key];
      }

      var cancelId = run.debounce.apply(run, [this, debouncedFn].concat(debounceArgs));

      pendingDebounces[name] = { debouncedFn: debouncedFn, cancelId: cancelId };
    },

    /**
     Cancel a previously debounced task.
      Example:
      ```js
     import Component from 'ember-component';
     import ContextBoundTasksMixin from 'ember-lifeline/mixins/run';
      export default Component.extend(ContextBoundTasksMixin, {
       logMe() {
         console.log('This will only run once every 300ms.');
       },
        click() {
         this.debounceTask('logMe', 300);
       },
        disable() {
          this.cancelDebounce('logMe');
       }
     });
     ```
      @method cancelDebounce
     @param { String } methodName the name of the debounced method to cancel
     @public
     */
    cancelDebounce: function cancelDebounce(name) {
      _cancelDebounce(this._pendingDebounces, name);
    },

    /**
     Runs the function with the provided name immediately, and only once in the time window
     specified by the timeout argument.
      Example:
      ```js
     import Component from 'ember-component';
     import ContextBoundTasksMixin from 'ember-lifeline/mixins/run';
      export default Component.extend(ContextBoundTasksMixin, {
       logMe() {
         console.log('This will run once immediately, then only once every 300ms.');
       },
        click() {
         this.throttleTask('logMe', 300);
       }
     });
     ```
      @method throttleTask
     @param { String } functionName the name of the function to debounce
     @param { Number } [timeout=5] the time in the future to run the callback (defaults to 5ms)
     @public
     */
    throttleTask: function throttleTask(name) {
      var timeout = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      assert('Called `throttleTask` without a string as the first argument on ' + this + '.', typeof name === 'string');
      assert('Called `this.throttleTask(\'' + name + '\', ' + timeout + ')` where \'this.' + name + '\' is not a function.', typeof this[name] === 'function');
      assert('Called `throttleTask` on destroyed object: ' + this + '.', !this.isDestroyed);

      run.throttle(this, name, timeout);
    },

    /**
     Sets up a function that can perform polling logic in a testing safe way.
     The callback is invoked synchronusly with an argument (generally called `next`).
     In normal development/production when `next` is invoked, it will trigger the
     task again (recursively). However, when in test mode the recursive polling
     functionality is disabled, and usage of the `pollTaskFor` helper is required.
      Example:
      ```js
     // app/components/foo-bar.js
     export default Component.extend({
       api: injectService(),
        init() {
         this._super(...arguments);
          this.pollTask((next) => {
           this.get('api').request('get', 'some/path')
             .then(() => {
               this.runTask(next, 1800);
             })
         }, 'foo-bar#watch-some-path');
       }
     });
     ```
      Test Example:
      ```js
     import wait from 'ember-test-helpers/wait';
     import { pollTaskFor } from 'ember-lifeline/mixins/run';
      //...snip...
      test('foo-bar watches things', function(assert) {
       this.render(hbs`{{foo-bar}}`);
        return wait()
         .then(() => {
           assert.equal(serverRequests, 1, 'called initially');
            pollTaskFor('foo-bar#watch-some-path');
           return wait();
         })
         .then(() => {
           assert.equal(serverRequests, 2, 'called again');
         });
     });
     ```
      @method pollTask
     @param { Function | String } callbackOrMethodName the callback or method name to run
     @param { String } [label] the label for the pollTask to be created
     @public
     */
    pollTask: function pollTask(callbackOrMethodName, label) {
      var _this3 = this;

      var next = undefined,
          callback = undefined;
      var type = typeof callbackOrMethodName;

      if (type === 'function') {
        callback = callbackOrMethodName;
      } else if (type === 'string' && this[callbackOrMethodName]) {
        callback = this[callbackOrMethodName];
      } else {
        throw new Error('You must pass a callback function or method name to `pollTask`.');
      }

      var tick = function tick() {
        return callback.call(_this3, next);
      };

      if (label) {
        assert('The label provided to `pollTask` must be unique. `' + label + '` has already been registered.', !pollTaskLabels[label]);
        pollTaskLabels[label] = true;

        this._getOrAllocateArray('_pollerLabels').push(label);
      }

      if (shouldPoll()) {
        next = tick;
      } else if (label) {
        next = function () {
          queuedPollTasks[label] = tick;
        };
      } else {
        next = function () {};
      }

      callback.call(this, next);
    },

    /**
     Clears a previously setup polling task.
      Example:
      ```js
     // app/components/foo-bar.js
     export default Component.extend({
       api: injectService(),
        enableAutoRefresh() {
         this.pollTask((next) => {
           this.get('api').request('get', 'some/path')
             .then(() => {
               this.runTask(next, 1800);
             })
         }, 'foo-bar#watch-some-path');
       },
        disableAutoRefresh() {
          this.cancelPoll('foo-bar#watch-some-path');
       }
     });
     ```
      @method cancelPoll
     @param { String } label the label for the pollTask to be cleared
     @public
     */
    cancelPoll: function cancelPoll(label) {
      _cancelPoll(label);
    },

    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);

      cancelTimers(this._pendingTimers);
      cancelDebounces(this._pendingDebounces);
      clearPollers(this._pollerLabels);
    },

    _getOrAllocateArray: function _getOrAllocateArray(propertyName) {
      if (!this[propertyName]) {
        this[propertyName] = [];
      }

      return this[propertyName];
    },

    _getOrAllocateObject: function _getOrAllocateObject(propertyName) {
      if (!this[propertyName]) {
        this[propertyName] = {};
      }

      return this[propertyName];
    }
  });

  function clearPollers(labels) {
    if (!labels || !labels.length) {
      return;
    }

    for (var i = 0; i < labels.length; i++) {
      _cancelPoll(labels[i]);
    }
  }

  function _cancelPoll(label) {
    pollTaskLabels[label] = undefined;
    queuedPollTasks[label] = undefined;
  }

  function cancelTimers(timers) {
    if (!timers || !timers.length) {
      return;
    }

    for (var i = 0; i < timers.length; i++) {
      cancelTimer(timers[i]);
    }
  }

  function cancelTimer(cancelId) {
    run.cancel(cancelId);
  }

  function cancelDebounces(pendingDebounces) {
    var debounceNames = pendingDebounces && Object.keys(pendingDebounces);

    if (!debounceNames || !debounceNames.length) {
      return;
    }

    for (var i = 0; i < debounceNames.length; i++) {
      _cancelDebounce(pendingDebounces, debounceNames[i]);
    }
  }

  function _cancelDebounce(pendingDebounces, name) {
    var cancelId = pendingDebounces[name].cancelId;

    run.cancel(cancelId);
  }
});