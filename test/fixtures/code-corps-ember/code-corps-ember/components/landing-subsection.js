define('code-corps-ember/components/landing-subsection', ['exports', 'code-corps-ember/mixins/can-animate'], function (exports, _canAnimate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var htmlSafe = Ember.String.htmlSafe;
  var computed = Ember.computed;
  exports.default = Component.extend(_canAnimate.default, {
    attributeBindings: ['style'],
    classNames: ['landing-subsection'],
    classNameBindings: ['animated:animated'],

    animated: computed('canAnimate', function () {
      var canAnimate = this.get('canAnimate');
      if (canAnimate) {
        this.set('_hasAnimated', true);
      }
      return this.get('_hasAnimated');
    }),

    style: computed('minHeight', function () {
      var css = 'min-height: ' + this.get('minHeight') + 'px;';
      return htmlSafe(css);
    })
  });
});