define('percy-web/models/repo', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    githubId: _emberData.default.attr('number'),
    name: _emberData.default.attr(),
    slug: _emberData.default.attr(),
    htmlUrl: _emberData.default.attr(),
    isPrivate: _emberData.default.attr('boolean'),
    description: _emberData.default.attr(),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date')
  });
});