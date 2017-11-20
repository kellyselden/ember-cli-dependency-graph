define('ember-composable-helpers/helpers/object-at', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.objectAt = objectAt;

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
  var emberArray = Ember.A;
  var isEmberArray = Ember.isArray;
  var computed = Ember.computed;
  var observer = Ember.observer;
  var get = Ember.get;
  var set = Ember.set;
  function objectAt(index, array) {
    if (!isEmberArray(array)) {
      return undefined;
    }

    index = parseInt(index, 10);

    return emberArray(array).objectAt(index);
  }

  exports.default = Helper.extend({
    content: computed('index', 'array.[]', function () {
      var index = get(this, 'index');
      var array = get(this, 'array');

      return objectAt(index, array);
    }),

    compute: function compute(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          index = _ref2[0],
          array = _ref2[1];

      set(this, 'index', index);
      set(this, 'array', array);

      return get(this, 'content');
    },


    contentDidChange: observer('content', function () {
      this.recompute();
    })
  });
});