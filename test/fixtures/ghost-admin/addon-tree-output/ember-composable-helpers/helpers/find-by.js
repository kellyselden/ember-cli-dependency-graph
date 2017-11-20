define('ember-composable-helpers/helpers/find-by', ['exports'], function (exports) {
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

  var computed = Ember.computed;
  var Helper = Ember.Helper;
  var get = Ember.get;
  var observer = Ember.observer;
  var set = Ember.set;
  var emberArray = Ember.A;
  var isEmpty = Ember.isEmpty;
  var defineProperty = Ember.defineProperty;
  exports.default = Helper.extend({
    compute: function compute(_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          byPath = _ref2[0],
          value = _ref2[1],
          array = _ref2[2];

      set(this, 'array', array);
      set(this, 'byPath', byPath);
      set(this, 'value', value);

      return get(this, 'content');
    },


    byPathDidChange: observer('byPath', function () {
      var byPath = get(this, 'byPath');

      if (isEmpty(byPath)) {
        defineProperty(this, 'content', []);
        return;
      }

      defineProperty(this, 'content', computed('array.@each.' + byPath, 'value', function () {
        var array = get(this, 'array');
        var value = get(this, 'value');

        return emberArray(array).findBy(byPath, value);
      }));
    }),

    contentDidChange: observer('content', function () {
      this.recompute();
    })
  });
});