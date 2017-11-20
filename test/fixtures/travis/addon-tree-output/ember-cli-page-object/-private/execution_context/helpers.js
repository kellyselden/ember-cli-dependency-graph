define('ember-cli-page-object/-private/execution_context/helpers', ['exports', 'ember-cli-page-object/-private/better-errors'], function (exports, _emberCliPageObjectPrivateBetterErrors) {
  exports.fillElement = fillElement;

  /**
   * @private
   *
   * Fills inputs, textareas, or contenteditable elements with the passed-in content.
   *
   * @param {jQuery} $selection              jQuery object containing collection of DOM elements to fill in
   * @param {string} content                 Content to be inserted into the target element(s)
   * @param {Object} options                 Options for error reporting
   * @param {string} options.selector        jQuery selector used to target element(s) to fill in
   * @param {Ceibo} options.pageObjectNode   PageObject node containing the method which, when invoked, resulted in this call to `fillElement`
   * @param {string} options.pageObjectKey   Key of method on PageObject which, when invoked, resulted in this call to `fillElement`
   * @return
   *
   * @throws Will throw an error if called on a contenteditable element that has `contenteditable="false"`
   */

  function fillElement($selection, content, _ref) {
    var selector = _ref.selector;
    var pageObjectNode = _ref.pageObjectNode;
    var pageObjectKey = _ref.pageObjectKey;

    if ($selection.is('[contenteditable][contenteditable!="false"]')) {
      $selection.html(content);
    } else if ($selection.is('[contenteditable="false"]')) {
      (0, _emberCliPageObjectPrivateBetterErrors.throwBetterError)(pageObjectNode, pageObjectKey, 'Element cannot be filled because it has `contenteditable="false"`.', { selector: selector });
    } else {
      $selection.val(content);
    }
  }
});