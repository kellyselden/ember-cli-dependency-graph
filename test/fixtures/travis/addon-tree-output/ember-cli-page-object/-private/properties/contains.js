define('ember-cli-page-object/-private/properties/contains', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.contains = contains;

  /**
   * Returns a boolean representing whether an element or a set of elements contains the specified text.
   *
   * @example
   *
   * // Lorem <span>ipsum</span>
   *
   * const page = PageObject.create({
   *   spanContains: PageObject.contains('span')
   * });
   *
   * assert.ok(page.spanContains('ipsum'));
   *
   * @example
   *
   * // <span>lorem</span>
   * // <span>ipsum</span>
   * // <span>dolor</span>
   *
   * const page = PageObject.create({
   *   spansContain: PageObject.contains('span', { multiple: true })
   * });
   *
   * // not all spans contain 'lorem'
   * assert.notOk(page.spansContain('lorem'));
   *
   * @example
   *
   * // <span>super text</span>
   * // <span>regular text</span>
   *
   * const page = PageObject.create({
   *   spansContain: PageObject.contains('span', { multiple: true })
   * });
   *
   * // all spans contain 'text'
   * assert.ok(page.spanContains('text'));
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span>ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * const page = PageObject.create({
   *   spanContains: PageObject.contains('span', { scope: '.scope' })
   * });
   *
   * assert.notOk(page.spanContains('lorem'));
   * assert.ok(page.spanContains('ipsum'));
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span>ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * const page = PageObject.create({
   *   scope: '.scope',
  
   *   spanContains: PageObject.contains('span')
   * });
   *
   * assert.notOk(page.spanContains('lorem'));
   * assert.ok(page.spanContains('ipsum'));
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector contain the subtext
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */

  function contains(selector) {
    var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return {
      isDescriptor: true,

      get: function get(key) {
        return function (textToSearch) {
          var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
          var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key + '("' + textToSearch + '")' }, userOptions);

          return executionContext.run(function (context) {
            var elements = context.findWithAssert(selector, options);

            return (0, _emberCliPageObjectPrivateHelpers.every)(elements, function (element) {
              return element.text().indexOf(textToSearch) >= 0;
            });
          });
        };
      }
    };
  }
});