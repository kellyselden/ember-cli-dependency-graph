define('ember-power-select/components/power-select/power-select-group', ['exports', 'ember-power-select/templates/components/power-select/power-select-group'], function (exports, _powerSelectGroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var reads = Ember.computed.reads;
  exports.default = Component.extend({
    layout: _powerSelectGroup.default,
    tagName: '',
    disabled: reads('group.disabled'),
    groupName: reads('group.groupName')
  });
});