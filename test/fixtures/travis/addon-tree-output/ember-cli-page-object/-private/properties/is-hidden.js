define('ember-cli-page-object/-private/properties/is-hidden', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.isHidden = isHidden;

  /**
   * Validates if an element or set of elements is hidden or does not exist in the DOM.
   *
   * @example
   *
   * // Lorem <span style="display:none">ipsum</span>
   *
   * const page = PageObject.create({
   *   spanIsHidden: PageObject.isHidden('span')
   * });
   *
   * assert.ok(page.spanIsHidden);
   *
   * @example
   *
   * // <span>ipsum</span>
   * // <span style="display:none">dolor</span>
   *
   * const page = create({
   *   spansAreHidden: PageObject.isHidden('span', { multiple: true })
   * });
   *
   * // not all spans are hidden
   * assert.notOk(page.spansAreHidden);
   *
   * @example
   *
   * // <span style="display:none">dolor</span>
   * // <span style="display:none">dolor</span>
   *
   * const page = create({
   *   spansAreHidden: PageObject.isHidden('span', { multiple: true })
   * });
   *
   * // all spans are hidden
   * assert.ok(page.spansAreHidden);
   *
   * @example
   *
   * // Lorem <strong>ipsum</strong>
   *
   * const page = PageObject.create({
   *   spanIsHidden: PageObject.isHidden('span')
   * });
   *
   * // returns true when element doesn't exist in DOM
   * assert.ok(page.spanIsHidden);
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span style="display:none">ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * const page = PageObject.create({
   *   scopedSpanIsHidden: PageObject.isHidden('span', { scope: '.scope' })
   * });
   *
   * assert.ok(page.scopedSpanIsHidden);
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span style="display:none">ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * const page = PageObject.create({
   *   scope: '.scope',
   *   scopedSpanIsHidden: PageObject.isHidden('span')
   * });
   *
   * assert.ok(page.scopedSpanIsHidden);
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector are hidden
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */

  function isHidden(selector) {
    var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return {
      isDescriptor: true,

      get: function get(key) {
        var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
        var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key }, userOptions);

        return executionContext.run(function (context) {
          var elements = context.find(selector, options);

          return (0, _emberCliPageObjectPrivateHelpers.every)(elements, function (element) {
            return element.is(':hidden');
          });
        });
      }
    };
  }
});