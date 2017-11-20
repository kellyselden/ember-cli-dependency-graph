define('ember-composable-helpers/helpers/compact', ['exports'], function (exports) {
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

  var emberArray = Ember.A;
  var isEmberArray = Ember.isArray;
  var filter = Ember.computed.filter;
  var Helper = Ember.Helper;
  var get = Ember.get;
  var observer = Ember.observer;
  var set = Ember.set;
  var isPresent = Ember.isPresent;
  exports.default = Helper.extend({
    compute: function compute(_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          array = _ref2[0];

      if (!isEmberArray(array)) {
        return emberArray([array]);
      }

      set(this, 'array', array);

      return get(this, 'content');
    },


    content: filter('array', isPresent),

    contentDidChange: observer('content', function () {
      this.recompute();
    })
  });
});