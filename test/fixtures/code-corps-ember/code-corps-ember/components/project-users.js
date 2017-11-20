define('code-corps-ember/components/project-users', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  exports.default = Component.extend({
    classNames: ['project-users'],
    count: alias('users.length')
  });
});