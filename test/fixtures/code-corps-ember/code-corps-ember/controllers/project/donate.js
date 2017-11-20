define('code-corps-ember/controllers/project/donate', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  var alias = Ember.computed.alias;
  var get = Ember.get;
  exports.default = Controller.extend({
    amount: 25,
    queryParams: ['amount'],

    project: alias('model'),

    actions: {
      continueToCheckout: function continueToCheckout(amount) {
        var project = get(this, 'project');
        var queryParams = { amount: amount };
        this.transitionToRoute('project.checkout', project, { queryParams: queryParams });
      }
    }
  });
});