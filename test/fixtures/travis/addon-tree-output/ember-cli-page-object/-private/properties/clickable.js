define('ember-cli-page-object/-private/properties/clickable', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.clickable = clickable;

  /**
   * Clicks elements matched by a selector.
   *
   * @example
   *
   * // <button class="continue">Continue<button>
   * // <button>Cancel</button>
   *
   * const page = PageObject.create({
   *   continue: clickable('button.continue')
   * });
   *
   * // clicks on element with selector 'button.continue'
   * page.continue();
   *
   * @example
   *
   * // <div class="scope">
   * //   <button>Continue<button>
   * // </div>
   * // <button>Cancel</button>
   *
   * const page = PageObject.create({
   *   continue: clickable('button.continue', { scope: '.scope' })
   * });
   *
   * // clicks on element with selector '.scope button.continue'
   * page.continue();
   *
   * @example
   *
   * // <div class="scope">
   * //   <button>Continue<button>
   * // </div>
   * // <button>Cancel</button>
   *
   * const page = PageObject.create({
   *   scope: '.scope',
   *   continue: clickable('button.continue')
   * });
   *
   * // clicks on element with selector '.scope button.continue'
   * page.continue();
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to click
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.visible - Make the action to raise an error if the element is not visible
   * @param {boolean} options.resetScope - Ignore parent scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */

  function clickable(selector) {
    var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return {
      isDescriptor: true,

      get: function get(key) {
        return function () {
          var _this = this;

          var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
          var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key + '()' }, userOptions);

          return executionContext.runAsync(function (context) {
            var fullSelector = (0, _emberCliPageObjectPrivateHelpers.buildSelector)(_this, selector, options);
            var container = options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(_this, 'testContainer');

            context.assertElementExists(fullSelector, options);

            context.click(fullSelector, container);
          });
        };
      }
    };
  }
});