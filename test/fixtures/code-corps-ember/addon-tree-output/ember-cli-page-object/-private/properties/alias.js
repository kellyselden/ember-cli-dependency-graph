define('ember-cli-page-object/-private/properties/alias', ['exports', 'ember-cli-page-object/-private/execution_context', 'ember-cli-page-object/-private/better-errors', 'ember-cli-page-object/-private/helpers'], function (exports, _emberCliPageObjectPrivateExecution_context, _emberCliPageObjectPrivateBetterErrors, _emberCliPageObjectPrivateHelpers) {
  exports.alias = alias;

  var ALIASED_PROP_NOT_FOUND = 'PageObject does not contain aliased property';

  /**
   * Returns the value of some other property on the PageObject.
   *
   * @example
   *
   * import { create } from 'ember-cli-page-object';
   * import { alias } from 'ember-cli-page-object/macros';
   *
   * const page = create({
   *   submitButton: {
   *     scope: '.submit-button'
   *   },
   *   submit: alias('submitButton.click')
   * });
   *
   * // calls `page.submitButton.click`
   * page.submit();
   *
   * @example
   *
   * import { create } from 'ember-cli-page-object';
   * import { alias } from 'ember-cli-page-object/macros';
   *
   * const page = create({
   *   submitButton: {
   *     scope: '.submit-button'
   *   },
   *   isSubmitButtonVisible: alias('submitButton.isVisible')
   * });
   *
   * // checks value of `page.submitButton.isVisible`
   * assert.ok(page.isSubmitButtonVisible);
   *
   * @example
   *
   * import { create } from 'ember-cli-page-object';
   * import { alias } from 'ember-cli-page-object/macros';
   *
   * const page = create({
   *   form: {
   *     input: {
   *       scope: 'input'
   *     },
   *     submitButton: {
   *       scope: '.submit-button'
   *     }
   *   },
   *   fillFormInput: alias('form.input.fillIn', { chainable: true }),
   *   submitForm: alias('form.submitButton.click', { chainable: true })
   * });
   *
   * // executes `page.form.input.fillIn` then `page.form.submitButton.click`
   * // and causes both methods to return `page` (instead of `page.form.input`
   * // and `page.form.submitButton` respectively) so that the aliased methods
   * // can be chained off `page`.
   * page
   *   .fillFormInput('foo')
   *   .submitForm();
   *
   * @public
   *
   * @param {string} pathToProp - dot-separated path to a property specified on the PageObject
   * @param {Object} options
   * @param {Boolean} options.chainable - when this is true, an aliased
   * method returns the PageObject node on which the alias is defined, rather
   * than the PageObject node on which the aliased property is defined.
   * @return {Descriptor}
   *
   * @throws Will throw an error if the PageObject does not have the specified property.
   */

  function alias(pathToProp) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return {
      isDescriptor: true,

      get: function get(key) {
        if (!(0, _emberCliPageObjectPrivateHelpers.objectHasProperty)(this, pathToProp)) {
          (0, _emberCliPageObjectPrivateBetterErrors.throwBetterError)(this, key, ALIASED_PROP_NOT_FOUND + ' `' + pathToProp + '`.');
        }

        var value = (0, _emberCliPageObjectPrivateHelpers.getProperty)(this, pathToProp);

        if (typeof value !== 'function' || !options.chainable) {
          return value;
        }

        var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);

        return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return executionContext.runAsync(function () {
            return value.apply(undefined, args);
          });
        };
      }
    };
  }
});