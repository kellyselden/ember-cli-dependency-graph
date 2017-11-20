define('percy-web/models/screenshot', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    snapshot: _emberData.default.belongsTo('snapshot', { async: false }),
    image: _emberData.default.belongsTo('image', { async: false, inverse: null }),
    lossyImage: _emberData.default.belongsTo('image', { async: false, inverse: null }),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date')
  });
});