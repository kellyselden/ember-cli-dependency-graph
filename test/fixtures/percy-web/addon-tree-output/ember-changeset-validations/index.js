define('ember-changeset-validations/index', ['exports', 'ember-changeset-validations/utils/wrap', 'ember-changeset-validations/utils/handle-multiple-validations', 'ember-changeset/utils/is-promise'], function (exports, _wrap, _handleMultipleValidations, _isPromise) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = lookupValidator;
  var isEmpty = Ember.isEmpty,
      isArray = Ember.isArray;
  function lookupValidator() {
    var validationMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return function (_ref) {
      var key = _ref.key,
          newValue = _ref.newValue,
          oldValue = _ref.oldValue,
          changes = _ref.changes,
          content = _ref.content;

      var validator = validationMap[key];

      if (isEmpty(validator)) {
        return true;
      }

      if (isArray(validator)) {
        return (0, _handleMultipleValidations.default)(validator, { key: key, newValue: newValue, oldValue: oldValue, changes: changes, content: content });
      }

      var validation = validator(key, newValue, oldValue, changes, content);

      return (0, _isPromise.default)(validation) ? validation.then(_wrap.default) : [validation];
    };
  }
});