define('code-corps-ember/controllers/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  exports.default = Controller.extend({
    typedStrings: ['social good.', 'elections.', 'schools.', 'the environment.', 'science.', 'hospitals.', 'ending poverty.', 'political activism.', 'communities.', 'justice.', 'ending climate change.', 'families.', 'government.']
  });
});