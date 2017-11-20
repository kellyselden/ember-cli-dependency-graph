define('percy-web/mirage/factories/screenshot', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    afterCreate: function afterCreate(screenshot, server) {
      if (screenshot.image === null) {
        var image = server.create('image', {
          url: '/images/test/bs-base.png',
          width: 1280,
          height: 1485
        });
        screenshot.update({ image: image });
      }
      if (screenshot.lossyImage === null) {
        var lossyImage = server.create('image', {
          url: '/images/test/bs-base-lossy.jpg',
          width: 900,
          height: 1044
        });
        screenshot.update({ lossyImage: lossyImage });
      }
    }
  });
});