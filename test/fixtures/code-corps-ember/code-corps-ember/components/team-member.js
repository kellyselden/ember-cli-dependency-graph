define('code-corps-ember/components/team-member', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var computed = Ember.computed;
  exports.default = Component.extend({
    tagName: 'li',

    src: computed('imageSlug', function () {
      var imageSlug = this.get('imageSlug');
      return 'https://d3pgew4wbk2vb1.cloudfront.net/images/team/' + imageSlug + '.png';
    })
  });
});