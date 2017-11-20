define("ember-autoresize/ext/text-field", ["exports", "ember", "ember-autoresize/mixins/autoresize"], function (exports, _ember, _emberAutoresizeMixinsAutoresize) {

  var _get = _ember["default"].get;
  var isEmpty = _ember["default"].isEmpty;

  /**
    @namespace Ember
    @class TextField
   */
  _ember["default"].TextField.reopen(_emberAutoresizeMixinsAutoresize["default"], /** @scope Ember.TextField.prototype */{

    /**
      By default, text fields only
      resize their width.
       @property shouldResizeWidth
      @default true
      @type Boolean
     */
    shouldResizeWidth: true,

    /**
      Whitespace should be treated as significant
      for text fields.
       @property significantWhitespace
      @default true
      @type Boolean
     */
    significantWhitespace: true,

    /**
      This provides a single character
      so users can click into an empty
      text field without it being too small
       If a placeholder is set,
      it will be used instead.
       @property autoResizeText
      @type String
     */
    autoResizeText: _ember["default"].computed('value', 'placeholder', {
      get: function get() {
        var placeholder = _get(this, 'placeholder');
        var value = _get(this, 'value');

        if (isEmpty(value)) {
          return isEmpty(placeholder) ? '.' : placeholder;
        }

        return value;
      }
    })
  });
});