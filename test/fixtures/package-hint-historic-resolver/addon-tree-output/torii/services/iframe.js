define('torii/services/iframe', ['exports', 'torii/mixins/ui-service-mixin'], function (exports, _uiServiceMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Iframe = Ember.Object.extend(Ember.Evented, _uiServiceMixin.default, {

    openRemote: function openRemote(url) {
      this.remote = Ember.$('<iframe src="' + url + '" id="torii-iframe"></iframe>');
      var iframeParent = '.torii-iframe-placeholder';
      Ember.$(iframeParent).append(this.remote);
    },

    closeRemote: function closeRemote() {
      this.remote.remove();
    },

    pollRemote: function pollRemote() {
      if (Ember.$('#torii-iframe').length === 0) {
        this.trigger('didClose');
      }
    }

  });

  exports.default = Iframe;
});