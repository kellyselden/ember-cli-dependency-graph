define('percy-web/models/image', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    sha: _emberData.default.attr(),
    mimetype: _emberData.default.attr(),
    url: _emberData.default.attr(),
    width: _emberData.default.attr('number'),
    height: _emberData.default.attr('number'),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date')
  });
});