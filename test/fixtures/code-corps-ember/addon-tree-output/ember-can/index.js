define('ember-can/index', ['exports', 'ember-can/ability', 'ember-can/can-mixin', 'ember-can/computed', 'ember-can/services/can'], function (exports, _emberCanAbility, _emberCanCanMixin, _emberCanComputed, _emberCanServicesCan) {
  exports.Ability = _emberCanAbility['default'];
  exports.CanMixin = _emberCanCanMixin['default'];
  exports.CanService = _emberCanServicesCan['default'];
  exports.computed = _emberCanComputed['default'];
});