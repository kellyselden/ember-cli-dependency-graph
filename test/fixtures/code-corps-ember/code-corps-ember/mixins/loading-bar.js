define('code-corps-ember/mixins/loading-bar', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var service = Ember.inject.service;
  var Mixin = Ember.Mixin;
  exports.default = Mixin.create({
    loadingBar: service(),

    actions: {
      loading: function loading(transition) {
        this._super.apply(this, arguments);
        var loadingBar = get(this, 'loadingBar');
        loadingBar.start();
        transition.promise.finally(function () {
          loadingBar.stop();
        });
        return true;
      },
      error: function error() {
        this._super.apply(this, arguments);
        var loadingBar = get(this, 'loadingBar');
        loadingBar.stop();
      }
    }
  });
});