define('ember-power-select/helpers/ember-power-select-is-selected', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.emberPowerSelectIsSelected = emberPowerSelectIsSelected;

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

  var helper = Ember.Helper.helper;
  var isEmberArray = Ember.isArray;
  var isEqual = Ember.isEqual;


  // TODO: Make it private or scoped to the component
  function emberPowerSelectIsSelected(_ref) /* , hash*/{
    var _ref2 = _slicedToArray(_ref, 2),
        option = _ref2[0],
        selected = _ref2[1];

    if (selected === undefined || selected === null) {
      return false;
    }
    if (isEmberArray(selected)) {
      for (var i = 0; i < selected.length; i++) {
        if (isEqual(selected[i], option)) {
          return true;
        }
      }
      return false;
    } else {
      return isEqual(option, selected);
    }
  }

  exports.default = helper(emberPowerSelectIsSelected);
});