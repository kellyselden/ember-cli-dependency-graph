define('percy-web/components/build-info-dropdown', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    icon: null,
    renderInPlace: null,
    isShowingModal: false,
    classNames: ['BuildInfoDropdown'],

    actions: {
      toggleModal: function toggleModal() {
        this.toggleProperty('isShowingModal');
      }
    }
  });
});