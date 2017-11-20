define('ember-promise-helpers/helpers/await', ['exports', 'ember'], function (exports, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var RSVP = _ember['default'].RSVP;
  var Promise = RSVP.Promise;
  exports['default'] = _ember['default'].Helper.extend({
    /**
     * @property valueBeforeSettled
     * @default null
     *
     * This is the value that gets returned synchronously as the helper's return
     * value before the promise is settled. For example `{{async promise}}` will return
     * null, before the promise is resolved or rejected.
    */
    valueBeforeSettled: null,

    /**
     * @method compute
     * @public
     * @param params Array a list of arguments passed to the Helper.
     * @param hash Object a list of configuration options passed to the helper.
     * This parameter is currently unused by Await.
    */
    compute: function compute(_ref, hash) {
      var _this = this;

      var _ref2 = _slicedToArray(_ref, 1);

      var maybePromise = _ref2[0];

      if (!maybePromise || typeof maybePromise.then !== 'function') {
        return maybePromise;
      }

      return this.ensureLatestPromise(maybePromise, function (promise) {
        promise.then(function (value) {
          _this.setValue(value, maybePromise);
        })['catch'](function () {
          _this.setValue(null, maybePromise);
        });
      });
    },

    /**
     * @method ensureLatestPromise
     * @public
     * @param promise Promise the new promise coming
     * @param callback Function function to be called with a wrapped promise
     *
     * Method to set the latest promise. This gets called by `compute` (which in
     * turn gets called by `recompute`). If the promise being passed in is the
     * same as before, then just return the value to `compute`. Otherwise, call
     * the callback so the user can call `then`, `catch`, or `finally` on the
     * promise to update the value using `setValue` later.
    */
    ensureLatestPromise: function ensureLatestPromise(promise, callback) {
      if (this._wasSettled && promise === this._promise) {
        return this._value;
      } else {
        this._unsettle();
      }

      this._promise = promise;

      callback.call(this, Promise.resolve(promise));
      return this.get('valueBeforeSettled');
    },

    /**
     * @method _settle
     * @private
    */
    _settle: function _settle(promise) {
      if (this.allowUpdates(promise)) {
        this._wasSettled = true;
        this.recompute();
      }
    },

    /**
     * @private
     * @method _unsettle
     *
     * Resets the promise to null and calls recompute. Designed to be used
     * when a new promise is passed to the `compute` method. This would happen
     * when the value changes in Handlebars.
    */
    _unsettle: function _unsettle() {
      this._wasSettled = false;
      this._promise = null;
    },

    /**
     * @method setValue
     * @public
     * @param value Any the value to return to the helper
     * @param promise Promise the promise the `setValue` call is coming from.
     *
     * `setValue` is how you should set the value to be returned to the helper
     * in the app. It exists to prevent race conditions between promises.
     * For example, you may have two promises:
     *
     * ```javascript
     * let promise1 = new Ember.RSVP.Promise((resolve, reject) => {resolve("hello");});
     * let promise2 = new Ember.RSVP.Promise((resolve, reject) => {(resolve("goodbye")});
     * ```
     *
     * And a template:
     *
     * ```handlebars
     * {{await promise}}
     * ```
     *
     * If you set the value of `promise` to be `promise1` via your component,
     * controller, or route, when the promise resolves, it will render the value
     * of `promise1`, which is "hello".
     *
     * If you set the avlue of `promise` to `promise2`, you would see "goodbye".
     *
     * But what happens if `promise1` resolves asynchronously, e.g., using `Ember.run.later`?
     *
     * ```javascript
     * Ember.run.later(function() {
     *  resolve("hello");
     * }, 200);
     * ```
     *
     * Even though `promise2` already resolved with "goodbye", the template would
     * render "hello", which is not the intended behavior. So, `setValue` makes you pass
     * the promise so the internal book-keeping can ensure the last-set promise always wins.
    */
    setValue: function setValue(value, promise) {
      if (this.allowUpdates(promise)) {
        this._value = value;
        this._settle(promise);
      }
    },

    allowUpdates: function allowUpdates(promise) {
      return this._promise === promise;
    }
  });
});