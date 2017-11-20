define('ember-composable-helpers/helpers/shuffle', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shuffle = shuffle;

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
  var Helper = Ember.Helper;
  var observer = Ember.observer;
  var get = Ember.get;
  var set = Ember.set;
  var typeOf = Ember.typeOf;
  function shuffle(array, randomizer) {
    array = array.slice(0);
    var count = get(array, 'length');
    var rand = void 0,
        temp = void 0;
    randomizer = typeOf(randomizer) === 'function' && randomizer || Math.random;

    while (count > 1) {
      rand = Math.floor(randomizer() * count--);

      temp = array[count];
      array[count] = array[rand];
      array[rand] = temp;
    }
    return array;
  }

  exports.default = Helper.extend({
    compute: function compute(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          random = _ref2[0],
          array = _ref2[1];

      if (array === undefined) {
        array = random;
        random = undefined;
      }

      if (!isEmberArray(array)) {
        return emberArray([array]);
      }

      set(this, 'array', array);
      return shuffle(array, random);
    },


    arrayContentDidChange: observer('array.[]', function () {
      this.recompute();
    })
  });
});