define('ember-cli-page-object/-private/properties/has-class', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.hasClass = hasClass;

  /**
   * Validates if an element or a set of elements have a given CSS class.
   *
   * @example
   *
   * // <em class="lorem"></em><span class="success">Message!</span>
   *
   * const page = PageObject.create({
   *   messageIsSuccess: PageObject.hasClass('success', 'span')
   * });
   *
   * assert.ok(page.messageIsSuccess);
   *
   * @example
   *
   * // <span class="success"></span>
   * // <span class="error"></span>
   *
   * const page = PageObject.create({
   *   messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
   * });
   *
   * assert.notOk(page.messagesAreSuccessful);
   *
   * @example
   *
   * // <span class="success"></span>
   * // <span class="success"></span>
   *
   * const page = PageObject.create({
   *   messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
   * });
   *
   * assert.ok(page.messagesAreSuccessful);
   *
   * @example
   *
   * // <div>
   * //   <span class="lorem"></span>
   * // </div>
   * // <div class="scope">
   * //   <span class="ipsum"></span>
   * // </div>
   *
   * const page = PageObject.create({
   *   spanHasClass: PageObject.hasClass('ipsum', 'span', { scope: '.scope' })
   * });
   *
   * assert.ok(page.spanHasClass);
   *
   * @example
   *
   * // <div>
   * //   <span class="lorem"></span>
   * // </div>
   * // <div class="scope">
   * //   <span class="ipsum"></span>
   * // </div>
   *
   * const page = PageObject.create({
   *   scope: '.scope',
   *   spanHasClass: PageObject.hasClass('ipsum', 'span')
   * });
   *
   * assert.ok(page.spanHasClass);
   *
   * @public
   *
   * @param {string} cssClass - CSS class to be validated
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector have the CSS class
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */

  function hasClass(cssClass, selector) {
    var userOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return {
      isDescriptor: true,

      get: function get(key) {
        var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
        var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key }, userOptions);

        return executionContext.run(function (context) {
          var elements = context.findWithAssert(selector, options);

          return (0, _emberCliPageObjectPrivateHelpers.every)(elements, function (element) {
            return element.hasClass(cssClass);
          });
        });
      }
    };
  }
});