define('ember-can/helpers/cannot', ['exports', 'ember'], function (exports, _ember) {
  var getOwner = _ember['default'].getOwner;
  var typeOf = _ember['default'].typeOf;
  exports['default'] = _ember['default'].Helper.extend({
    helper: _ember['default'].computed(function () {
      var helper = getOwner(this).lookup('helper:can');

      return typeOf(helper) === 'instance' ? helper : helper.create();
    }),

    compute: function compute(params, hash) {
      return !this.get('helper').compute(params, hash);
    }
  });
});