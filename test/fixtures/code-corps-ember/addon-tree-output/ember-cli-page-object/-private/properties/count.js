define('ember-cli-page-object/-private/properties/count', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.count = count;

  /**
   * @public
   *
   * Returns the number of elements matched by a selector.
   *
   * @example
   *
   * // <span>1</span>
   * // <span>2</span>
   *
   * const page = PageObject.create({
   *   spanCount: PageObject.count('span')
   * });
   *
   * assert.equal(page.spanCount, 2);
   *
   * @example
   *
   * // <div>Text</div>
   *
   * const page = PageObject.create({
   *   spanCount: PageObject.count('span')
   * });
   *
   * assert.equal(page.spanCount, 0);
   *
   * @example
   *
   * // <div><span></span></div>
   * // <div class="scope"><span></span><span></span></div>
   *
   * const page = PageObject.create({
   *   spanCount: PageObject.count('span', { scope: '.scope' })
   * });
   *
   * assert.equal(page.spanCount, 2)
   *
   * @example
   *
   * // <div><span></span></div>
   * // <div class="scope"><span></span><span></span></div>
   *
   * const page = PageObject.create({
   *   scope: '.scope',
   *   spanCount: PageObject.count('span')
   * });
   *
   * assert.equal(page.spanCount, 2)
   *
   * @example
   *
   * // <div><span></span></div>
   * // <div class="scope"><span></span><span></span></div>
   *
   * const page = PageObject.create({
   *   scope: '.scope',
   *   spanCount: PageObject.count('span', { resetScope: true })
   * });
   *
   * assert.equal(page.spanCount, 1);
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element or elements to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Add scope
   * @param {boolean} options.resetScope - Ignore parent scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */

  function count(selector) {
    var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return {
      isDescriptor: true,

      get: function get(key) {
        var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
        var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key }, userOptions);

        options = (0, _emberCliPageObjectPrivateHelpers.assign)(options, { multiple: true });

        return executionContext.run(function (context) {
          return context.find(selector, options).length;
        });
      }
    };
  }
});