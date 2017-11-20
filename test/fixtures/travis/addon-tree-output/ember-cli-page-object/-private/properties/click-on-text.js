define('ember-cli-page-object/-private/properties/click-on-text', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context', 'ember-cli-page-object/-private/properties/click-on-text/helpers'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context, _emberCliPageObjectPrivatePropertiesClickOnTextHelpers) {
  exports.clickOnText = clickOnText;

  /**
   * Clicks on an element containing specified text.
   *
   * The element can either match a specified selector,
   * or be inside an element matching the specified selector.
   *
   * @example
   *
   * // <fieldset>
   * //  <button>Lorem</button>
   * //  <button>Ipsum</button>
   * // </fieldset>
   *
   * const page = PageObject.create({
   *   clickOnFieldset: PageObject.clickOnText('fieldset'),
   *   clickOnButton: PageObject.clickOnText('button')
   * });
   *
   * // queries the DOM with selector 'fieldset :contains("Lorem"):last'
   * page.clickOnFieldset('Lorem');
   *
   * // queries the DOM with selector 'button:contains("Ipsum")'
   * page.clickOnButton('Ipsum');
   *
   * @example
   *
   * // <div class="scope">
   * //   <fieldset>
   * //    <button>Lorem</button>
   * //    <button>Ipsum</button>
   * //   </fieldset>
   * // </div>
   *
   * const page = PageObject.create({
   *   clickOnFieldset: PageObject.clickOnText('fieldset', { scope: '.scope' }),
   *   clickOnButton: PageObject.clickOnText('button', { scope: '.scope' })
   * });
   *
   * // queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
   * page.clickOnFieldset('Lorem');
   *
   * // queries the DOM with selector '.scope button:contains("Ipsum")'
   * page.clickOnButton('Ipsum');
   *
   * @example
   *
   * // <div class="scope">
   * //   <fieldset>
   * //    <button>Lorem</button>
   * //    <button>Ipsum</button>
   * //   </fieldset>
   * // </div>
   *
   * const page = PageObject.create({
   *   scope: '.scope',
   *   clickOnFieldset: PageObject.clickOnText('fieldset'),
   *   clickOnButton: PageObject.clickOnText('button')
   * });
   *
   * // queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
   * page.clickOnFieldset('Lorem');
   *
   * // queries the DOM with selector '.scope button:contains("Ipsum")'
   * page.clickOnButton('Ipsum');
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element in which to look for text
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.visible - Make the action to raise an error if the element is not visible
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */

  function clickOnText(selector) {
    var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return {
      isDescriptor: true,

      get: function get(key) {
        return function (textToClick) {
          var _this = this;

          var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
          var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key + '("' + textToClick + '")', contains: textToClick }, userOptions);

          return executionContext.runAsync(function (context) {
            var fullSelector = (0, _emberCliPageObjectPrivatePropertiesClickOnTextHelpers.buildSelector)(_this, context, selector, options);
            var container = options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(_this, 'testContainer');

            context.assertElementExists(fullSelector, options);

            context.click(fullSelector, container);
          });
        };
      }
    };
  }
});