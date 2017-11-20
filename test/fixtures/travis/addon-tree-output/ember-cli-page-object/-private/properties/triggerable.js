define('ember-cli-page-object/-private/properties/triggerable', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.triggerable = triggerable;

  /**
   *
   * Triggers event on element matched by selector.
   *
   * @example
   *
   * // <input class="name">
   * // <input class="email">
   *
   * const page = PageObject.create({
   *   focus: triggerable('focus', '.name')
   * });
   *
   * // focuses on element with selector '.name'
   * page.focus();
   *
   * @example
   *
   * // <input class="name">
   * // <input class="email">
   *
   * const page = PageObject.create({
   *   enter: triggerable('keypress', '.name', { eventProperties: { keyCode: 13 } })
   * });
   *
   * // triggers keypress using enter key on element with selector '.name'
   * page.enter();
   *
   * @example
   *
   * // <div class="scope">
   * //   <input class="name">
   * // </div>
   * // <input class="email">
   *
   * const page = PageObject.create({
   *   focus: triggerable('focus', '.name', { scope: '.scope' })
   * });
   *
   * // focuses on element with selector '.scope .name'
   * page.focus();
   *
   * @example
   *
   * // <div class="scope">
   * //   <input class="name">
   * // </div>
   * // <input class="email">
   *
   * const page = PageObject.create({
   *   scope: '.scope',
   *   focus: triggerable('focus', '.name')
   * });
   *
   * // clicks on element with selector '.scope button.continue'
   * page.focus();
   *
   * @public
   *
   * @param {string} event - Event to be triggered
   * @param {string} selector - CSS selector of the element on which the event will be triggered
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Ignore parent scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @param {string} options.eventProperties - Event properties that will be passed to trigger function
   * @return {Descriptor}
  */

  function triggerable(event, selector) {
    var userOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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

            context.triggerEvent(fullSelector, container, event, options.eventProperties);
          });
        };
      }
    };
  }
});