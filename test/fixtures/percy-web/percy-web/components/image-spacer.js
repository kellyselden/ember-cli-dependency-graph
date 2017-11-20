define('percy-web/components/image-spacer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var htmlSafe = Ember.String.htmlSafe;
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    image: null,
    imageClass: '',

    action: null,
    bubbles: true,

    classNames: ['ImageSpacer'],
    attributeBindings: ['style'],
    style: computed('image.width', 'image.height', function () {
      var scale = this.get('image.height') * 100.0 / this.get('image.width');
      return htmlSafe('padding-top: ' + scale + '%');
    }),

    click: function click(e) {
      var action = this.get('action');
      if (action) {
        action();
      }
      if (!this.get('bubbles')) {
        e.stopPropagation();
      }
    }
  });
});