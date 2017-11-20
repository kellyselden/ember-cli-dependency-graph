define('percy-web/models/commit', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  exports.default = _emberData.default.Model.extend({
    sha: _emberData.default.attr(),
    shaShort: computed('sha', function () {
      var sha = this.get('sha');
      return sha && sha.slice(0, 7);
    }),

    message: _emberData.default.attr(),
    authorName: _emberData.default.attr(),
    committerName: _emberData.default.attr(),
    committedAt: _emberData.default.attr('date'),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date')
  });
});