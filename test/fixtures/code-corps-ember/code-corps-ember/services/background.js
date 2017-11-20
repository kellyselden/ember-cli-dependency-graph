define('code-corps-ember/services/background', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var computed = Ember.computed;
  var run = Ember.run;
  var Service = Ember.Service;
  exports.default = Service.extend({
    reset: function reset() {
      $('html').removeClass('warning danger');
    },


    setBackgroundClass: computed(function () {
      var _this = this;

      return function () {
        $('html').addClass(_this.get('class'));
      };
    }),

    updateBackgroundClass: function updateBackgroundClass() {
      run.once(this, this.get('setBackgroundClass'));
    }
  });
});