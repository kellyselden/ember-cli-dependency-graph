define('percy-web/components/build-width-selector', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var oneWay = Ember.computed.oneWay;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['WidthSelector'],
    defaultSelectedWidth: null,
    selectedWidth: oneWay('defaultSelectedWidth'),
    actions: {
      updateSelectedWidth: function updateSelectedWidth(value) {
        if (value === 'select-width') {
          value = null;
        }

        var updateSelectedWidth = this.get('updateSelectedWidth');
        this.set('selectedWidth', value);
        updateSelectedWidth(value);

        this.analytics.track('Build Width Selected', null, { width: value });
      }
    }
  });
});