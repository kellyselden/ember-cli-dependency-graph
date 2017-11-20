define('ember-promise-helpers/helpers/promise-hash', ['exports', 'ember'], function (exports, _ember) {
  var RSVP = _ember['default'].RSVP;
  exports['default'] = _ember['default'].Helper.extend({
    compute: function compute(params, hash) {
      return RSVP.hash(hash);
    }
  });
});