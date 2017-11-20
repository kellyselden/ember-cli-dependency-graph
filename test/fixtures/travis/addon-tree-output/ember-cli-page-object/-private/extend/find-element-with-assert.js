define('ember-cli-page-object/-private/extend/find-element-with-assert', ['exports', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateExecution_context) {
  exports.findElementWithAssert = findElementWithAssert;

  /**
   * @public
   *
   * Returns a jQuery element matched by a selector built from parameters
   *
   * @example
   *
   * import { findElementWithAssert } from 'ember-cli-page-object/extend';
   *
   * export default function isDisabled(selector, options = {}) {
   *   return {
   *     isDescriptor: true,
   *
   *     get() {
   *       return findElementWithAssert(this, selector, options).is(':disabled');
   *     }
   *   };
   * }
   *
   * @param {Ceibo} pageObjectNode - Node of the tree
   * @param {string} targetSelector - Specific CSS selector
   * @param {Object} options - Additional options
   * @param {boolean} options.resetScope - Do not use inherited scope
   * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
   * @param {number} options.at - Filter by index using :eq(x) pseudo-class
   * @param {boolean} options.last - Filter by using :last pseudo-class
   * @param {boolean} options.visible - Filter by using :visible pseudo-class
   * @param {boolean} options.multiple - Specify if built selector can match multiple elements.
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @param {string} options.pageObjectKey - Used in the error message when the element is not found
   * @return {Object} jQuery object
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */

  function findElementWithAssert(pageObjectNode, targetSelector) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(pageObjectNode);

    return executionContext.run(function (context) {
      return context.findWithAssert(targetSelector, options);
    });
  }
});