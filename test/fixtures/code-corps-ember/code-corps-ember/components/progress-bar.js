define('code-corps-ember/components/progress-bar', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var htmlSafe = Ember.String.htmlSafe;
  var computed = Ember.computed;
  var get = Ember.get;
  exports.default = Component.extend({
    attributeBindings: ['style'],
    classNames: ['progress-bar'],
    classNameBindings: ['animatedClass', 'errorClass'],

    animated: false,
    error: false,

    animatedClass: computed('animated', function () {
      var animated = get(this, 'animated');
      return animated ? 'progress-bar--animated' : '';
    }),

    errorClass: computed('error', function () {
      var error = get(this, 'error');
      return error ? 'progress-bar--error' : '';
    }),

    /**
      The `style` property consumes the current percentage to generate the style
      string for the `progress-bar`. `style` is bound to the components style
      attribute.
       @property style
      @type String
     */
    style: computed('percentage', function () {
      var percentage = this.get('percentage') || 0;
      var css = 'width: ' + percentage + '%;';

      return htmlSafe(css);
    })
  });
});