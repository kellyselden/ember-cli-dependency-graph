define('ember-cli-page-object/-private/properties/is-visible', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.isVisible = isVisible;

  /**
   * Validates if an element or set of elements are visible.
   *
   * @example
   *
   * // Lorem <span>ipsum</span>
   *
   * const page = PageObject.create({
   *   spanIsVisible: PageObject.isVisible('span')
   * });
   *
   * assert.ok(page.spanIsVisible);
   *
   * @example
   *
   * // <span>ipsum</span>
   * // <span style="display:none">dolor</span>
   *
   * const page = PageObject.create({
   *   spansAreVisible: PageObject.isVisible('span', { multiple: true })
   * });
   *
   * // not all spans are visible
   * assert.notOk(page.spansAreVisible);
   *
   * @example
   *
   * // <span>ipsum</span>
   * // <span>dolor</span>
   *
   * const page = PageObject.create({
   *   spansAreVisible: PageObject.isVisible('span', { multiple: true })
   * });
   *
   * // all spans are visible
   * assert.ok(page.spansAreVisible);
   *
   * @example
   *
   * // Lorem <strong>ipsum</strong>
   *
   * const page = PageObject.create({
   *   spanIsVisible: PageObject.isVisible('span')
   * });
   *
   * // returns false when element doesn't exist in DOM
   * assert.notOk(page.spanIsVisible);
   *
   * @example
   *
   * // <div>
   * //   <span style="display:none">lorem</span>
   * // </div>
   * // <div class="scope">
   * //   <span>ipsum</span>
   * // </div>
   *
   * const page = PageObject.create({
   *   spanIsVisible: PageObject.isVisible('span', { scope: '.scope' })
   * });
   *
   * assert.ok(page.spanIsVisible);
   *
   * @example
   *
   * // <div>
   * //   <span style="display:none">lorem</span>
   * // </div>
   * // <div class="scope">
   * //   <span>ipsum</span>
   * // </div>
   *
   * const page = PageObject.create({
   *   scope: '.scope',
   *   spanIsVisible: PageObject.isVisible('span')
   * });
   *
   * assert.ok(page.spanIsVisible);
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector are visible
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */

  function isVisible(selector) {
    var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return {
      isDescriptor: true,

      get: function get(key) {
        var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
        var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key }, userOptions);

        return executionContext.run(function (context) {
          var elements = context.find(selector, options);

          if (elements.length === 0) {
            return false;
          }

          return (0, _emberCliPageObjectPrivateHelpers.every)(elements, function (element) {
            return element.is(':visible');
          });
        });
      }
    };
  }
});