define('ember-composable-helpers/-private/create-needle-haystack-helper', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createNeedleHaystackHelper;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var computed = Ember.computed;
  var Helper = Ember.Helper;
  var get = Ember.get;
  var observer = Ember.observer;
  var set = Ember.set;
  var isEmpty = Ember.isEmpty;

  var K = function K() {};

  /**
   * Creates a generic Helper class implementation that expects a `needle` and
   * `haystack` as arguments. A `fn` function is required to be passed in
   * that is invoked with the `needle` and `haystack` arguments.
   *
   * @private
   * @param  {Function} fn A function to run against the needle and haystack
   * @return {Any}
   */
  function createNeedleHaystackHelper() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : K;

    return Helper.extend({
      content: computed('needle.[]', 'haystack.[]', 'option', function () {
        var needle = get(this, 'needle');
        var haystack = get(this, 'haystack');
        var option = get(this, 'option');

        return fn(needle, haystack, option);
      }).readOnly(),

      compute: function compute(_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
            needle = _ref2[0],
            option = _ref2[1],
            haystack = _ref2[2];

        if (isEmpty(haystack)) {
          haystack = option;
          option = null;
        }

        set(this, 'needle', needle);
        set(this, 'haystack', haystack);
        set(this, 'option', option);

        return get(this, 'content');
      },


      contentDidChange: observer('content', function () {
        this.recompute();
      })
    });
  }
});