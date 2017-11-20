define('ember-composable-helpers/helpers/reduce', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var Helper = Ember.Helper;
  var get = Ember.get;
  var observer = Ember.observer;
  var set = Ember.set;
  var isEmpty = Ember.isEmpty;
  var computed = Ember.computed;
  var defineProperty = Ember.defineProperty;
  exports.default = Helper.extend({
    compute: function compute(_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          callback = _ref2[0],
          initialValue = _ref2[1],
          array = _ref2[2];

      set(this, 'callback', callback);
      set(this, 'array', array);
      set(this, 'initialValue', initialValue);

      return get(this, 'content');
    },


    callbackDidChange: observer('callback', 'initialValue', function () {
      var _this = this;

      var callback = get(this, 'callback');
      var initialValue = get(this, 'initialValue');

      if (isEmpty(callback)) {
        defineProperty(this, 'content', []);
        return;
      }

      var cp = computed('array.[]', function () {
        var array = get(_this, 'array');
        return array.reduce(callback, initialValue);
      });

      defineProperty(this, 'content', cp);
    }),

    contentDidChange: observer('content', function () {
      this.recompute();
    })
  });
});