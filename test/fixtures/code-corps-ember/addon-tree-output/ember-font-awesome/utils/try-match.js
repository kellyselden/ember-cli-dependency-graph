define('ember-font-awesome/utils/try-match', ['exports'], function (exports) {
  exports['default'] = function (object, regex) {
    return typeof object === 'string' && object.match(regex);
  };
});