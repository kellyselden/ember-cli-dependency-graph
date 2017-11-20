define('ember-cli-page-object/-private/properties/property', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.property = property;

  /**
   * @public
   *
   * Returns the value of a property from the matched element, or an array of
   * values from multiple matched elements.
   *
   * @example
   * // <input type="checkbox" checked="checked">
   *
   * const page = PageObject.create({
   *   isChecked: PageObject.property('checked', 'input')
   * });
   *
   * assert.ok(page.isChecked);
   *
   * @example
   *
   * // <input type="checkbox" checked="checked">
   * // <input type="checkbox" checked="">
   *
   * const page = PageObject.create({
   *   inputsChecked: PageObject.property('checked', 'input', { multiple: true })
   * });
   *
   * assert.deepEqual(page.inputsChecked, [true, false]);
   *
   * @example
   *
   * // <div><input></div>
   * // <div class="scope"><input type="checkbox" checked="checked"></div>
   * // <div><input></div>
   *
   * const page = PageObject.create({
   *   isChecked: PageObject.property('checked', 'input', { scope: '.scope' })
   * });
   *
   * assert.ok(page.isChecked);
   *
   * @public
   *
   * @param {string} propertyName - Name of the property to get
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.multiple - If set, the function will return an array of values
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */

  function property(propertyName, selector) {
    var userOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return {
      isDescriptor: true,

      get: function get(key) {
        var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
        var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key }, userOptions);

        return executionContext.run(function (context) {
          var elements = context.findWithAssert(selector, options);
          var result = undefined;

          result = (0, _emberCliPageObjectPrivateHelpers.map)(elements, function (element) {
            return element.prop(propertyName);
          });

          return options.multiple ? result : result[0];
        });
      }
    };
  }
});