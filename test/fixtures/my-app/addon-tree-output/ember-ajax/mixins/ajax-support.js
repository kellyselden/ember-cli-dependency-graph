define('ember-ajax/mixins/ajax-support', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin,
      service = Ember.inject.service,
      alias = Ember.computed.alias;
  exports.default = Mixin.create({

    /**
     * The AJAX service to send requests through
     *
     * @property {AjaxService} ajaxService
     * @public
     */
    ajaxService: service('ajax'),

    /**
     * @property {string} host
     * @public
     */
    host: alias('ajaxService.host'),

    /**
     * @property {string} namespace
     * @public
     */
    namespace: alias('ajaxService.namespace'),

    /**
     * @property {object} headers
     * @public
     */
    headers: alias('ajaxService.headers'),

    ajax: function ajax(url) {
      var augmentedOptions = this.ajaxOptions.apply(this, arguments);

      return this.get('ajaxService').request(url, augmentedOptions);
    }
  });
});