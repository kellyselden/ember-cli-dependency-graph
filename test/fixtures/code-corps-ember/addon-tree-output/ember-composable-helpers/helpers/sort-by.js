define('ember-composable-helpers/helpers/sort-by', ['exports'], function (exports) {
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
  var sort = Ember.computed.sort;
  var Helper = Ember.Helper;
  var get = Ember.get;
  var observer = Ember.observer;
  var set = Ember.set;
  var isEmpty = Ember.isEmpty;
  var typeOf = Ember.typeOf;
  var defineProperty = Ember.defineProperty;
  exports.default = Helper.extend({
    compute: function compute(params) {
      // slice params to avoid mutating the provided params
      var sortProps = params.slice();
      var array = sortProps.pop();

      var _sortProps = sortProps,
          _sortProps2 = _slicedToArray(_sortProps, 1),
          firstSortProp = _sortProps2[0];

      if (typeOf(firstSortProp) === 'function' || isEmberArray(firstSortProp)) {
        sortProps = firstSortProp;
      }

      set(this, 'array', array);
      set(this, 'sortProps', sortProps);

      return get(this, 'content');
    },


    sortPropsDidChange: observer('sortProps', function () {
      var sortProps = get(this, 'sortProps');

      if (isEmpty(sortProps)) {
        defineProperty(this, 'content', []);
      }

      if (typeof sortProps === 'function') {
        defineProperty(this, 'content', sort('array', sortProps));
      } else {
        defineProperty(this, 'content', sort('array', 'sortProps'));
      }
    }),

    contentDidChange: observer('content', function () {
      this.recompute();
    })
  });
});