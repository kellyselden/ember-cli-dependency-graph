define('ember-moment/computeds/from-now', ['exports', 'moment', 'ember-moment/computeds/-base'], function (exports, _moment, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  exports.default = (0, _base.default)(function fromNowComputed(params) {
    var maybeHideSuffix = void 0;

    if (params.length > 1) {
      maybeHideSuffix = params.pop();
    }

    return _moment.default.apply(undefined, _toConsumableArray(params)).fromNow(maybeHideSuffix);
  });
});