define('ember-changeset-validations/helpers/changeset', ['exports', 'ember-changeset', 'ember-changeset-validations', 'ember-changeset/utils/is-object', 'ember-changeset/utils/is-promise'], function (exports, _emberChangeset, _emberChangesetValidations, _isObject, _isPromise) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.changeset = changeset;

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
  function changeset(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        model = _ref2[0],
        validationMap = _ref2[1];

    if ((0, _isObject.default)(validationMap)) {
      if ((0, _isPromise.default)(model)) {
        return model.then(function (resolved) {
          return new _emberChangeset.default(resolved, (0, _emberChangesetValidations.default)(validationMap), validationMap);
        });
      }

      return new _emberChangeset.default(model, (0, _emberChangesetValidations.default)(validationMap), validationMap);
    }

    if ((0, _isPromise.default)(model)) {
      return model.then(function (resolved) {
        return new _emberChangeset.default(resolved, validationMap);
      });
    }

    return new _emberChangeset.default(model, validationMap);
  }

  exports.default = helper(changeset);
});