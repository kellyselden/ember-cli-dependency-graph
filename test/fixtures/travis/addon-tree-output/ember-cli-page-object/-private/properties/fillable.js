define('ember-cli-page-object/-private/properties/fillable', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  exports.fillable = fillable;

  /**
   * Alias for `fillable`, which works for inputs, HTML select menus, and
   * contenteditable elements.
   *
   * [See `fillable` for usage examples.](#fillable)
   *
   * @name selectable
   * @function
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to look for text
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */

  /**
   * Fills in an input matched by a selector.
   *
   * @example
   *
   * // <input value="">
   *
   * const page = PageObject.create({
   *   fillIn: PageObject.fillable('input')
   * });
   *
   * // result: <input value="John Doe">
   * page.fillIn('John Doe');
   *
   * @example
   *
   * // <div class="name">
   * //   <input value="">
   * // </div>
   * // <div class="last-name">
   * //   <input value= "">
   * // </div>
   *
   * const page = PageObject.create({
   *   fillInName: PageObject.fillable('input', { scope: '.name' })
   * });
   *
   * page.fillInName('John Doe');
   *
   * // result
   * // <div class="name">
   * //   <input value="John Doe">
   * // </div>
   *
   * @example
   *
   * // <div class="name">
   * //   <input value="">
   * // </div>
   * // <div class="last-name">
   * //   <input value= "">
   * // </div>
   *
   * const page = PageObject.create({
   *   scope: 'name',
   *   fillInName: PageObject.fillable('input')
   * });
   *
   * page.fillInName('John Doe');
   *
   * // result
   * // <div class="name">
   * //   <input value="John Doe">
   * // </div>
   *
   * @example <caption>Filling different inputs with the same property</caption>
   *
   * // <input id="name">
   * // <input name="lastname">
   * // <input data-test="email">
   * // <textarea aria-label="address"></textarea>
   * // <input placeholder="phone">
   * // <div contenteditable="true" id="bio"></div>
   *
   * const page = create({
   *   fillIn: fillable('input, textarea, [contenteditable]')
   * });
   *
   * page
   *   .fillIn('name', 'Doe')
   *   .fillIn('lastname', 'Doe')
   *   .fillIn('email', 'john@doe')
   *   .fillIn('address', 'A street')
   *   .fillIn('phone', '555-000')
   *   .fillIn('bio', 'The story of <b>John Doe</b>');
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to look for text
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */

  function fillable(selector) {
    var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return {
      isDescriptor: true,

      get: function get(key) {
        return function (contentOrClue, content) {
          var _this = this;

          var clue = undefined;

          if (content === undefined) {
            content = contentOrClue;
          } else {
            clue = contentOrClue;
          }

          var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);
          var options = (0, _emberCliPageObjectPrivateHelpers.assign)({ pageObjectKey: key + '()' }, userOptions);

          return executionContext.runAsync(function (context) {
            var fullSelector = (0, _emberCliPageObjectPrivateHelpers.buildSelector)(_this, selector, options);
            var container = options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(_this, 'testContainer');

            if (clue) {
              fullSelector = ['input', 'textarea', 'select', '[contenteditable]'].map(function (tag) {
                return [fullSelector + ' ' + tag + '[data-test="' + clue + '"]', fullSelector + ' ' + tag + '[aria-label="' + clue + '"]', fullSelector + ' ' + tag + '[placeholder="' + clue + '"]', fullSelector + ' ' + tag + '[name="' + clue + '"]', fullSelector + ' ' + tag + '#' + clue];
              }).reduce(function (total, other) {
                return total.concat(other);
              }, []).join(',');
            }

            context.assertElementExists(fullSelector, options);

            context.fillIn(fullSelector, container, options, content);
          });
        };
      }
    };
  }
});