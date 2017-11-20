define('ember-i18n/legacy/stream', ['exports', 'ember'], function (exports, _ember) {

  // As of v1.12, Streams are still private API. Thus, we need to reach in to
  // Ember internals to get access to it.
  //
  // See https://github.com/emberjs/ember.js/blob/v1.12.0/packages/ember-metal/lib/main.js#L384-L386
  // See https://github.com/emberjs/ember.js/pull/9693
  // See https://github.com/dockyard/ember-cli-i18n/blob/v0.0.6/addon/utils/stream.js

  exports['default'] = _ember['default'].__loader.require('ember-metal/streams/stream')['default'];
  var readHash = _ember['default'].__loader.require('ember-metal/streams/utils').readHash;
  exports.readHash = readHash;
});