define('ember-promise-helpers/helpers/promise-all', ['exports', 'ember'], function (exports, _ember) {
  var RSVP = _ember['default'].RSVP;
  exports['default'] = _ember['default'].Helper.extend({
    compute: function compute(params, hash) {
      var args = Array.isArray(params[0]) ? params[0] : params;

      return RSVP.all(args);
    }
  });
});