define('travis/helpers/filter-input', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (params, hash, options, env) {
    var onEvent = void 0;
    (true && !(params.length) && Ember.assert('You can only pass attributes to the `input` helper, not arguments', params.length));

    onEvent = hash.on;
    delete hash.on;
    hash.onEvent = onEvent || 'enter';
    return env.helpers.view.helperFunction.call(this, [TextField], hash, options, env);
  };

  var TextField = Ember.TextField;


  TextField.extend({
    keyUp: function keyUp(event) {
      return this.sendAction('action', this.get('_value'), event);
    },
    _elementValueDidChange: function _elementValueDidChange() {
      return this.set('_value', this.$().val());
    }
  });
});