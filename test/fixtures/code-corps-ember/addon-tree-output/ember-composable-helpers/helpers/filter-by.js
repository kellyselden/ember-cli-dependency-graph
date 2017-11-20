define('ember-composable-helpers/helpers/filter-by', ['exports', 'ember-composable-helpers/utils/is-equal'], function (exports, _isEqual) {
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

  var isEmberArray = Ember.isArray;
  var filter = Ember.computed.filter;
  var Helper = Ember.Helper;
  var get = Ember.get;
  var observer = Ember.observer;
  var set = Ember.set;
  var isEmpty = Ember.isEmpty;
  var isPresent = Ember.isPresent;
  var defineProperty = Ember.defineProperty;
  exports.default = Helper.extend({
    compute: function compute(_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          byPath = _ref2[0],
          value = _ref2[1],
          array = _ref2[2];

      if (!isEmberArray(array) && isEmberArray(value)) {
        array = value;
        value = undefined;
      }

      set(this, 'array', array);
      set(this, 'byPath', byPath);
      set(this, 'value', value);

      return get(this, 'content');
    },


    byPathDidChange: observer('byPath', 'value', function () {
      var byPath = get(this, 'byPath');
      var value = get(this, 'value');

      if (isEmpty(byPath)) {
        defineProperty(this, 'content', []);
        return;
      }

      var filterFn = void 0;

      if (isPresent(value)) {
        if (typeof value === 'function') {
          filterFn = function filterFn(item) {
            return value(get(item, byPath));
          };
        } else {
          filterFn = function filterFn(item) {
            return (0, _isEqual.default)(get(item, byPath), value);
          };
        }
      } else {
        filterFn = function filterFn(item) {
          return !!get(item, byPath);
        };
      }

      var cp = filter('array.@each.' + byPath, filterFn);

      defineProperty(this, 'content', cp);
    }),

    contentDidChange: observer('content', function () {
      this.recompute();
    })
  });
});