define('percy-web/helpers/simple-image', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.simpleImageHelper = simpleImageHelper;
  var helper = Ember.Helper.helper;
  var htmlSafe = Ember.String.htmlSafe;


  // Creates <img> tag strings directly. Helpful when image tags have bound, dynamic src attributes
  // and the binding can cause odd image refreshing or resizing.
  function simpleImageHelper(params) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var image = options.image;
    var classString = Ember.Handlebars.Utils.escapeExpression(options.classes || '');
    return htmlSafe('<img class="' + classString + '" src="' + image.get('url') + '" ' + ('width="' + image.get('width') + '" height="' + image.get('height') + '">'));
  }

  exports.default = helper(simpleImageHelper);
});