define('ember-light-table/utils/css-styleify', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = cssStyleify;
  var isPresent = _ember['default'].isPresent;
  var _Ember$String = _ember['default'].String;
  var dasherize = _Ember$String.dasherize;
  var htmlSafe = _Ember$String.htmlSafe;

  function cssStyleify() {
    var hash = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var styles = [];

    Object.keys(hash).forEach(function (key) {
      var value = hash[key];

      if (isPresent(value)) {
        styles.push(dasherize(key) + ': ' + value);
      }
    });

    return htmlSafe(styles.join('; '));
  }
});