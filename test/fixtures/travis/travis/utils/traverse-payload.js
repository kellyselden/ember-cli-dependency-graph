define('travis/utils/traverse-payload', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var isArray = Ember.isArray;


  var traverse = function traverse(object, callback) {
    if (!object) {
      return;
    }

    if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && !isArray(object)) {
      callback(object);
    }

    if (isArray(object)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = object[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          traverse(item, callback);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          var _item = object[key];
          traverse(_item, callback);
        }
      }
    }
  };

  exports.default = traverse;
});