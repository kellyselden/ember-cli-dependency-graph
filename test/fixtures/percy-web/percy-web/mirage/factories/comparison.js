define('percy-web/mirage/factories/comparison', ['exports', 'ember-cli-mirage', 'moment'], function (exports, _emberCliMirage, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    id: function id(i) {
      return 'comparison-' + i;
    },
    startedProcessingAt: function startedProcessingAt() {
      return (0, _moment.default)().subtract(65, 'seconds');
    },
    finishedProcessingAt: function finishedProcessingAt() {
      return (0, _moment.default)().subtract(23, 'seconds');
    },


    includeBaseScreenshot: true,
    includePdiff: true,
    includeHeadScreenshot: true,
    includeMobileScreenshot: false,

    wasAdded: (0, _emberCliMirage.trait)({
      includeBaseScreenshot: false,
      includePdiff: false
    }),

    wasRemoved: (0, _emberCliMirage.trait)({
      includeHeadScreenshot: false,
      includePdiff: false
    }),

    mobile: (0, _emberCliMirage.trait)({
      includeMobileVersion: true
    }),

    gotLonger: (0, _emberCliMirage.trait)({
      includePdiff: 'longer',
      includeHeadScreenshot: 'longer'
    }),

    gotShorter: (0, _emberCliMirage.trait)({
      includePdiff: 'longer',
      includeBaseScreenshot: 'longer'
    }),

    same: (0, _emberCliMirage.trait)({
      includePdiff: false,
      afterCreate: function afterCreate(comparison, server) {
        var diffImage = server.create('image', {
          url: '/images/test/-pdiff-base-head.png',
          width: 1280,
          height: 1485
        });

        comparison.update({ diffRatio: 0.0, diffImage: diffImage });
      }
    }),

    // TODO: this needs a complete rewrite to be much simpler, potentially with explicit comparison
    // factories types instead of traits that create combinations.
    afterCreate: function afterCreate(comparison, server) {
      var settings = {
        prefix: 'bs',
        width: 1280,
        height: 1485,
        postfix: '',
        pdiff: { width: 1280, height: 1485, ratio: 0.42, postfix: '' },
        lossy: { width: 900, height: 1044, postfix: '' },
        longer: {
          prefix: 'bs',
          postfix: '',
          width: 1280,
          height: 1814,
          pdiff: { width: 1280, height: 1814, ratio: 0.62, postfix: '-longer' },
          lossy: { width: 900, height: 1275, postfix: '-longer' }
        }
      };
      if (comparison.includeMobileVersion) {
        settings.prefix = 'bs-mobile';
        settings.width = 320;
        settings.height = 1598;
        settings.pdiff = { width: 320, height: 1598, ratio: 0.32, postfix: '' };
        settings.lossy = settings.pdiff;
        settings.longer.prefix = 'bs-mobile';
        settings.longer.postfix = '-longer';
        settings.longer.width = 320;
        settings.longer.height = 2757;
        settings.longer.pdiff = {
          width: 320,
          height: 2757,
          ratio: 0.72,
          postfix: '-longer'
        };
        settings.longer.lossy = settings.longer.pdiff;
      }
      if (comparison.diffImage === null && comparison.includePdiff) {
        var pdiffSettings = settings.pdiff;
        if (comparison.includePdiff === 'longer') {
          pdiffSettings = settings.longer.pdiff;
        }
        var diffImage = server.create('image', {
          url: '/images/test/' + settings.prefix + '-pdiff-base-head' + pdiffSettings.postfix + '.png',
          width: pdiffSettings.width,
          height: pdiffSettings.height
        });
        comparison.update({ diffRatio: pdiffSettings.ratio, diffImage: diffImage });
      }
      if (comparison.baseScreenshot === null && comparison.includeBaseScreenshot) {
        var lossy = settings.lossy;
        var lossless = settings;
        var variant = 'base';
        if (comparison.includeBaseScreenshot === 'longer') {
          lossy = settings.longer.lossy;
          lossless = settings.longer;
          variant = 'head';
        }
        var image = server.create('image', {
          url: '/images/test/' + lossless.prefix + '-' + variant + lossless.postfix + '.png',
          width: lossless.width,
          height: lossless.height
        });
        var lossyImage = server.create('image', {
          url: '/images/test/' + settings.prefix + '-' + variant + lossy.postfix + '-lossy.jpg',
          width: lossy.width,
          height: lossy.height
        });
        var baseScreenshot = server.create('screenshot', { image: image, lossyImage: lossyImage });
        comparison.update({ baseScreenshot: baseScreenshot });
      }
      if (comparison.headScreenshot === null && comparison.includeHeadScreenshot) {
        var _lossy = settings.lossy;
        var _lossless = settings;
        var _variant = 'head';
        if (comparison.includeBaseScreenshot === 'longer') {
          _variant = 'base';
        }
        if (comparison.includeHeadScreenshot === 'longer') {
          _lossy = settings.longer.lossy;
          _lossless = settings.longer;
        }
        var _image = server.create('image', {
          url: '/images/test/' + settings.prefix + '-' + _variant + _lossy.postfix + '.png',
          width: _lossless.width,
          height: _lossless.height
        });
        var _lossyImage = server.create('image', {
          url: '/images/test/' + settings.prefix + '-' + _variant + _lossy.postfix + '-lossy.jpg',
          width: _lossy.width,
          height: _lossy.height
        });
        var headScreenshot = server.create('screenshot', { image: _image, lossyImage: _lossyImage });
        comparison.update({ headScreenshot: headScreenshot });
        if (comparison.headSnapshot === null) {
          var headSnapshot = server.create('snapshot');
          comparison.update({ headScreenshot: headScreenshot, headSnapshot: headSnapshot });
        }
      }
      if (comparison.width === undefined && (comparison.includeHeadScreenshot || comparison.includeBaseScreenshot)) {
        comparison.update({ width: settings.width });
      }

      // Remove transient attributes.
      comparison.update({
        includeBaseScreenshot: undefined,
        includePdiff: undefined,
        includeHeadScreenshot: undefined,
        includeMobileVersion: undefined
      });
    }
  });
});