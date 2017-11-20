define('ember-cli-page-object/-private/better-errors', ['exports', 'ember', 'ceibo'], function (exports, _ember, _ceibo) {
  exports.throwBetterError = throwBetterError;
  var ELEMENT_NOT_FOUND = 'Element not found.';

  exports.ELEMENT_NOT_FOUND = ELEMENT_NOT_FOUND;
  /**
   * Throws an error with a descriptive message.
   *
   * @param {Ceibo} node              PageObject node containing the property that triggered the error
   * @param {string} key              Key of PageObject property tht triggered the error
   * @param {string} msg              Error message
   * @param {Object} options
   * @param {string} options.selector Selector of element targeted by PageObject property
   * @return {Ember.Error}
   */

  function throwBetterError(node, key, msg) {
    var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var selector = _ref.selector;

    var path = [key];
    var current = undefined;

    for (current = node; current; current = _ceibo['default'].parent(current)) {
      path.unshift(_ceibo['default'].meta(current).key);
    }

    path[0] = 'page';

    var fullErrorMessage = msg + '\n\nPageObject: \'' + path.join('.') + '\'';

    if (selector) {
      fullErrorMessage = fullErrorMessage + '\n  Selector: \'' + selector + '\'';
    }

    _ember['default'].Logger.error(fullErrorMessage);
    throw new _ember['default'].Error(fullErrorMessage);
  }
});