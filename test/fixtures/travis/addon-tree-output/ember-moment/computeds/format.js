define('ember-moment/computeds/format', ['exports', 'moment', 'ember-moment/computeds/-base'], function (exports, _moment, _base) {
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

  var CONFIG_KEY = 'config:environment';
  var get = Ember.get,
      getOwner = Ember.getOwner;
  exports.default = (0, _base.default)(function formatComputed(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        value = _ref2[0],
        optionalFormat = _ref2[1];

    if (!optionalFormat) {
      var owner = getOwner(this);

      if (owner && owner.hasRegistration && owner.hasRegistration(CONFIG_KEY)) {
        var config = owner.resolveRegistration(CONFIG_KEY);

        if (config) {
          optionalFormat = get(config, 'moment.outputFormat');
        }
      }
    }

    return (0, _moment.default)(value).format(optionalFormat);
  });
});