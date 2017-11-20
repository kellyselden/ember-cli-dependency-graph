define('ember-scrollable/util/css', ['exports', 'ember'], function (exports, _ember) {
  var isEmpty = _ember['default'].isEmpty;
  var htmlSafe = _ember['default'].String.htmlSafe;

  function styleify(obj) {
    if (isEmpty(obj)) {
      return htmlSafe('');
    }
    var styles = Object.keys(obj).reduce(function (styleString, key) {
      var styleValue = obj[key];
      if (!isEmpty(styleValue)) {
        styleString += key + ': ' + styleValue + '; ';
      }
      return styleString;
    }, '');
    return htmlSafe(styles);
  }

  exports.styleify = styleify;
});