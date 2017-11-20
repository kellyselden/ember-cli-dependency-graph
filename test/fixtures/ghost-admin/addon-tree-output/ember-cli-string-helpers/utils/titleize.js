define('ember-cli-string-helpers/utils/titleize', ['exports'], function (exports) {
  exports['default'] = titleize;

  function titleize() {
    var string = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    if (typeof string !== 'string') {
      throw new TypeError('Expected a string, got a ' + typeof string);
    }

    return string.toLowerCase().replace(/(?:^|\s|-|\/)\S/g, function (m) {
      return m.toUpperCase();
    });
  }
});