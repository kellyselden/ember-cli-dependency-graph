define('ember-inline-svg/helpers/inline-svg', ['exports', 'ember', 'ember-inline-svg/utils/general'], function (exports, _ember, _emberInlineSvgUtilsGeneral) {
  exports.inlineSvg = inlineSvg;

  function inlineSvg(svgs, path, options) {
    var jsonPath = (0, _emberInlineSvgUtilsGeneral.dottify)(path);
    var svg = _ember['default'].get(svgs, jsonPath);

    // TODO: Ember.get should return `null`, not `undefined`.
    // if (svg === null && /\.svg$/.test(path))
    if (typeof svg === "undefined" && /\.svg$/.test(path)) {
      svg = _ember['default'].get(svgs, jsonPath.slice(0, -4));
    }

    _ember['default'].assert("No SVG found for " + path, svg);

    svg = (0, _emberInlineSvgUtilsGeneral.applyClass)(svg, options['class']);

    return _ember['default'].String.htmlSafe(svg);
  }
});