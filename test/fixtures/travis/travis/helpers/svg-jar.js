define('travis/helpers/svg-jar', ['exports', 'ember-string', 'ember-svg-jar/utils/make-helper', 'ember-svg-jar/utils/make-svg', 'travis/inline-assets'], function (exports, _emberString, _makeHelper, _makeSvg, _inlineAssets) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.svgJar = svgJar;
  function svgJar(assetId, svgAttrs) {
    return (0, _emberString.htmlSafe)((0, _makeSvg.default)(assetId, svgAttrs, _inlineAssets.default));
  }

  exports.default = (0, _makeHelper.default)(svgJar);
});