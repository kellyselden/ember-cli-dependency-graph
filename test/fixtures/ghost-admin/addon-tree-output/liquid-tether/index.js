define('liquid-tether/index', ['exports', 'liquid-fire/constraint'], function (exports, _liquidFireConstraint) {
  exports.target = target;
  exports.onOpenTether = onOpenTether;
  exports.onCloseTether = onCloseTether;

  function target(name) {
    return new _liquidFireConstraint['default']('parentElementClass', '' + name);
  }

  function onOpenTether() {
    return new _liquidFireConstraint['default']('newValue', function (value) {
      return value !== null;
    });
  }

  function onCloseTether() {
    return new _liquidFireConstraint['default']('newValue', function (value) {
      return value === null;
    });
  }
});