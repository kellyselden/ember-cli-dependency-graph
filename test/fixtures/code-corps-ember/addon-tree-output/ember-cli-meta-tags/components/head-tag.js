define('ember-cli-meta-tags/components/head-tag', ['exports', 'ember-cli-meta-tags/templates/components/head-tag'], function (exports, _headTag) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _headTag.default,

    _setTagName: Ember.on('init', function () {
      this.set('tagName', this.get('headTag.type'));
    }),

    // expected head tag attributes
    attributeBindings: ['href', 'target', 'charset', 'crossorigin', 'hreflang', 'media', 'rel', 'rev', 'sizes', 'type', 'content', 'http-equiv', 'name', 'scheme', 'async', 'defer', 'src', 'property', 'itemprop'],
    href: Ember.computed.reads('headTag.attrs.href'),
    target: Ember.computed.reads('headTag.attrs.target'),
    charset: Ember.computed.reads('headTag.attrs.charset'),
    crossorigin: Ember.computed.reads('headTag.attrs.crossorigin'),
    hreflang: Ember.computed.reads('headTag.attrs.hreflang'),
    media: Ember.computed.reads('headTag.attrs.media'),
    rel: Ember.computed.reads('headTag.attrs.rel'),
    rev: Ember.computed.reads('headTag.attrs.rev'),
    sizes: Ember.computed.reads('headTag.attrs.sizes'),
    type: Ember.computed.reads('headTag.attrs.type'),
    content: Ember.computed.reads('headTag.attrs.content'),
    'http-equiv': Ember.computed.reads('headTag.attrs.http-equiv'),
    name: Ember.computed.reads('headTag.attrs.name'),
    scheme: Ember.computed.reads('headTag.attrs.scheme'),
    async: Ember.computed.reads('headTag.attrs.async'),
    defer: Ember.computed.reads('headTag.attrs.defer'),
    src: Ember.computed.reads('headTag.attrs.src'),
    property: Ember.computed.reads('headTag.attrs.property'),
    itemprop: Ember.computed.reads('headTag.attrs.itemprop')

  });
});