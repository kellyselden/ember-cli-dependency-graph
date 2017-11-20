define('ember-changeset-validations/utils/handle-multiple-validations', ['exports', 'ember-changeset/utils/is-promise'], function (exports, _isPromise) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = handleMultipleValidations;
  var emberArray = Ember.A,
      all = Ember.RSVP.all,
      get = Ember.get,
      typeOf = Ember.typeOf;


  /**
   * Rejects `true` values from an array of validations. Returns `true` when there
   * are no errors, or the error object if there are errors.
   *
   * @private
   * @param  {Array} validations
   * @return {Boolean|Any}
   */
  function handleValidations() {
    var validations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var rejectedValidations = emberArray(validations).reject(function (validation) {
      return typeOf(validation) === 'boolean' && validation;
    });

    return get(rejectedValidations, 'length') === 0 || rejectedValidations;
  }

  /**
   * Handles an array of validators and returns Promise.all if any value is a
   * Promise.
   *
   * @public
   * @param  {Array} validators Array of validator functions
   * @param  {String} options.key
   * @param  {Any} options.newValue
   * @param  {Any} options.oldValue
   * @param  {Object} options.changes
   * @param  {Object} options.content
   * @return {Promise|Boolean|Any}
   */
  function handleMultipleValidations(validators, _ref) {
    var key = _ref.key,
        newValue = _ref.newValue,
        oldValue = _ref.oldValue,
        changes = _ref.changes,
        content = _ref.content;

    var validations = emberArray(validators.map(function (validator) {
      return validator(key, newValue, oldValue, changes, content);
    }));

    if (emberArray(validations).any(_isPromise.default)) {
      return all(validations).then(handleValidations);
    }

    return handleValidations(validations);
  }
});