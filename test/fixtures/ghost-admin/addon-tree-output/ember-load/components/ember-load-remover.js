define('ember-load/components/ember-load-remover', ['exports', 'ember-load/templates/components/ember-load-remover'], function (exports, _emberLoadRemover) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var inject = Ember.inject,
      Component = Ember.Component,
      $ = Ember.$;
  exports.default = Component.extend({
    layout: _emberLoadRemover.default,
    'ember-load-config': inject.service(),
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.removeLoadingIndicator();
    },

    /**
     * remove the loading indicator. By default this
     * removes the first element with the '.ember-load-indicator'
     * found CSS class from the DOM
     * @public
     */
    removeLoadingIndicator: function removeLoadingIndicator() {
      var loadingIndicatorClass = this.get('ember-load-config.loadingIndicatorClass') || 'ember-load-indicator';
      $('.' + loadingIndicatorClass).remove();
    }
  });
});