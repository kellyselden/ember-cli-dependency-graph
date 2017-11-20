define('liquid-fire/components/illiquid-model', ['exports', 'liquid-fire/templates/components/illiquid-model'], function (exports, _illiquidModel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;


  var IlliquidModel = Component.extend({
    layout: _illiquidModel.default,
    tagName: '',
    didReceiveAttrs: function didReceiveAttrs() {
      if (!this.get('_fixedModel')) {
        this.set('_fixedModel', this.get('model'));
      }
    }
  });

  IlliquidModel.reopenClass({
    positionalParams: ['model']
  });

  exports.default = IlliquidModel;
});