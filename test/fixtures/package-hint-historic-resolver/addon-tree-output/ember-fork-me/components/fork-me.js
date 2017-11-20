define('ember-fork-me/components/fork-me', ['exports', 'ember-fork-me/templates/components/fork-me'], function (exports, _forkMe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;


  var MyComponent = Component.extend({
    layout: _forkMe.default,

    cssUrlBase: 'https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.0',
    title: 'Fork me on GitHub'
  });

  MyComponent.reopenClass({
    positionalParams: ['url']
  });

  exports.default = MyComponent;
});