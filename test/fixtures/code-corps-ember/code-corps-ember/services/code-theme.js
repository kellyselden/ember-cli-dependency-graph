define('code-corps-ember/services/code-theme', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var not = Ember.computed.not;
  var computed = Ember.computed;
  var Service = Ember.Service;
  exports.default = Service.extend({
    isLight: true,

    isDark: not('isLight'),

    className: computed('isLight', 'isDark', function () {
      if (this.get('isLight')) {
        return 'code-theme--light';
      } else if (this.get('isDark')) {
        return 'code-theme--dark';
      }
    }),

    toggle: function toggle() {
      this.toggleProperty('isLight');
    }
  });
});