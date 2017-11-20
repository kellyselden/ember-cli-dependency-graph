define('percy-web/components/nav-menu', ['exports', 'percy-web/mixins/target-application-actions'], function (exports, _targetApplicationActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend(_targetApplicationActions.default, {
    user: null,
    classes: null,

    session: service(),
    classNames: ['NavMenu'],
    classNameBindings: ['classes']
  });
});