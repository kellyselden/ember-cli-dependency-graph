define('ember-cli-meta-tags/components/head-tags', ['exports', 'ember-cli-meta-tags/templates/components/head-tags'], function (exports, _headTags) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: '',
    headTags: Ember.A([]),
    layout: _headTags.default
  });
});