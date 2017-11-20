define('code-corps-ember/components/animated-high-five', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var setDiff = Ember.computed.setDiff;
  var Component = Ember.Component;
  var run = Ember.run;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['animated-high-five'],
    classNameBindings: ['currentImage', 'initialAnimation', 'followOnAnimation', 'reset'],

    images: ['tone-1f3fb', 'tone-1f3fc', 'tone-1f3ff', 'tone-1f3fe', 'tone-1f3fd'],

    currentImage: null,
    followOnAnimation: false,
    initialAnimation: true,
    reset: false,

    init: function init() {
      this._super.apply(this, arguments);
      this.selectImage();
    },
    willDestroyElement: function willDestroyElement() {
      var followOnTimer = get(this, 'followOnTimer');
      var resetTimer = get(this, 'resetTimer');
      run.cancel(followOnTimer);
      run.cancel(resetTimer);
    },


    availableImages: setDiff('images', 'currentImageArray'),

    currentImageArray: computed('currentImage', function () {
      var currentImage = get(this, 'currentImage');
      return [currentImage];
    }),

    selectImage: function selectImage() {
      var images = get(this, 'availableImages');
      var image = images[Math.floor(Math.random() * images.length)];
      var that = this;

      set(this, 'currentImage', image);
      var followOnTimer = run.later(function () {
        set(that, 'followOnAnimation', false);
      }, 500);

      set(this, 'followOnTimer', followOnTimer);
      set(this, 'reset', true);

      var resetTimer = run.later(function () {
        set(that, 'reset', false);
      }, 1);
      set(this, 'resetTimer', resetTimer);
    },
    click: function click() {
      var that = this;
      var followOnTimer = get(this, 'followOnTimer');

      run.cancel(followOnTimer);
      this.selectImage();

      set(that, 'initialAnimation', false);
      set(that, 'followOnAnimation', true);
    }
  });
});