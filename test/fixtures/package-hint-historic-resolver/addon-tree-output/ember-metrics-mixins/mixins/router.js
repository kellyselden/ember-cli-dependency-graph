define('ember-metrics-mixins/mixins/router', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  var scheduleOnce = Ember.run.scheduleOnce;
  var assign = Ember.assign;
  var getOwner = Ember.getOwner;


  function trackPage(infos) {
    var _this = this;

    var metrics = getOwner(this).lookup('service:metrics');

    scheduleOnce('afterRender', function () {
      var options = {
        url: _this.get('url'),
        routeName: _this.get('currentRouteName')
      };

      assign(options, _this.mergeAdditionalOptions(infos));

      metrics.trackPage(options);
    });
  }

  exports.default = Mixin.create({
    didTransition: function didTransition() {
      this._super.apply(this, arguments);

      trackPage.apply(this, arguments);
    },
    mergeAdditionalOptions: function mergeAdditionalOptions() {
      return {};
    }
  });
});