/* globals Ember, require */

(function() {
  var _Ember;

  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (!_Ember.String.isHTMLSafe) {
    _Ember.String.isHTMLSafe = function(str) {
      return str && typeof str.toHTML === 'function';
    };
  }
})();
