define('ember-composable-helpers/helpers/map', ['exports'], function (exports) {
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

  var map = Ember.computed.map;
  var Helper = Ember.Helper;
  var get = Ember.get;
  var observer = Ember.observer;
  var set = Ember.set;
  var isEmpty = Ember.isEmpty;
  var defineProperty = Ember.defineProperty;
  exports.default = Helper.extend({
    compute: function compute(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          callback = _ref2[0],
          array = _ref2[1];

      set(this, 'array', array);
      set(this, 'callback', callback);

      return get(this, 'content');
    },


    byPathDidChange: observer('callback', function () {
      var callback = get(this, 'callback');

      if (isEmpty(callback)) {
        defineProperty(this, 'content', []);
        return;
      }

      defineProperty(this, 'content', map('array', callback));
    }),

    contentDidChange: observer('content', function () {
      this.recompute();
    })
  });
});