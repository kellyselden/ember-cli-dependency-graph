define('ember-svg-jar/utils/make-svg', ['exports', 'ember-utils'], function (exports, _emberUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatAttrs = formatAttrs;
  exports.symbolUseFor = symbolUseFor;
  exports.inlineSvgFor = inlineSvgFor;
  exports.default = makeSvg;
  var copy = Ember.copy,
      merge = Ember.merge;
  var warn = Ember.Logger.warn;
  function formatAttrs(attrs) {
    return Object.keys(attrs).map(function (key) {
      return !(0, _emberUtils.isNone)(attrs[key]) && key + '="' + attrs[key] + '"';
    }).filter(function (attr) {
      return attr;
    }).join(' ');
  }

  function symbolUseFor(assetId) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return '<svg ' + formatAttrs(attrs) + '><use xlink:href="' + assetId + '" /></svg>';
  }

  function inlineSvgFor(assetId, assetStore) {
    var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var svg = assetStore[assetId];

    if (!svg) {
      warn('ember-svg-jar: Missing inline SVG for ' + assetId);
      return;
    }

    var svgAttrs = svg.attrs ? merge(copy(svg.attrs), attrs) : attrs;
    var size = attrs.size;


    if (size) {
      svgAttrs.width = parseFloat(svgAttrs.width) * size || svgAttrs.width;
      svgAttrs.height = parseFloat(svgAttrs.height) * size || svgAttrs.height;
      delete svgAttrs.size; // eslint-disable-line no-param-reassign
    }

    return '<svg ' + formatAttrs(svgAttrs) + '>' + svg.content + '</svg>';
  }

  function makeSvg(assetId) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var assetStore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var isSymbol = assetId.lastIndexOf('#', 0) === 0;

    return isSymbol ? symbolUseFor(assetId, attrs) : inlineSvgFor(assetId, assetStore, attrs);
  }
});