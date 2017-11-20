define('code-corps-ember/components/donation-goal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['donation-goal'],
    classNameBindings: ['achieved', 'canEdit', 'current'],

    /**
     * Flag indicating if component should render the edit link. Should be set from outside
     *
     * @property canEdit
     * @type {Boolean}
     */
    canEdit: false,

    achieved: alias('donationGoal.achieved'),
    current: alias('donationGoal.current')
  });
});