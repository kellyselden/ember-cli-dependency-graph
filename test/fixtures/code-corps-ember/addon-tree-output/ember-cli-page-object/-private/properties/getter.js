define('ember-cli-page-object/-private/properties/getter', ['exports', 'ember-cli-page-object/-private/better-errors'], function (exports, _emberCliPageObjectPrivateBetterErrors) {
  exports.getter = getter;

  var NOT_A_FUNCTION_ERROR = 'Argument passed to `getter` must be a function.';

  /**
   * Creates a Descriptor whose value is determined by the passed-in function.
   * The passed-in function must not be bound and must not be an arrow function,
   * as this would prevent it from running with the correct context.
   *
   * @example
   *
   * // <input type="text">
   * // <button disabled>Submit</button>
   *
   * import { create } from 'ember-cli-page-object';
   * import { getter } from 'ember-cli-page-object/macros';
   *
   * const page = create({
   *   inputValue: value('input'),
   *   isSubmitButtonDisabled: property('disabled', 'button'),
   *
   *   // with the `getter` macro
   *   isFormEmpty: getter(function() {
   *     return !this.inputValue && this.isSubmitButtonDisabled;
   *   }),
   *
   *   // without the `getter` macro
   *   _isFormEmpty: {
   *     isDescriptor: true,
   *     get() {
   *       return !this.inputValue && this.isSubmitButtonDisabled;
   *     }
   *   }
   * });
   *
   * // checks the value returned by the function passed into `getter`
   * assert.ok(page.isFormEmpty);
   *
   * @public
   *
   * @param {Function} fn - determines what value is returned when the Descriptor is accessed
   * @return {Descriptor}
   *
   * @throws Will throw an error if a function is not passed in as the first argument
   */

  function getter(fn) {
    return {
      isDescriptor: true,

      get: function get(key) {
        if (typeof fn !== 'function') {
          (0, _emberCliPageObjectPrivateBetterErrors.throwBetterError)(this, key, NOT_A_FUNCTION_ERROR);
        }

        return fn.call(this, key);
      }
    };
  }
});