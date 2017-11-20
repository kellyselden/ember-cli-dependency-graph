define("ember-autoresize/ext/text-area", ["exports", "ember", "ember-autoresize/mixins/autoresize"], function (exports, _ember, _emberAutoresizeMixinsAutoresize) {

  var _get = _ember["default"].get;
  var isNone = _ember["default"].isNone;

  /**
    @namespace Ember
    @class TextArea
   */
  _ember["default"].TextArea.reopen(_emberAutoresizeMixinsAutoresize["default"], /** @scope Ember.TextArea.prototype */{

    /**
      By default, textareas only resize
      their height.
       @property shouldResizeHeight
      @type Boolean
     */
    shouldResizeHeight: true,

    /**
      Whitespace should be treated as significant
      for text areas.
       @property significantWhitespace
      @default true
      @type Boolean
     */
    significantWhitespace: true,

    /**
      Optimistically resize the height
      of the textarea so when users reach
      the end of a line, they will be
      presented with space to begin typing.
       @property autoResizeText
      @type String
     */
    autoResizeText: _ember["default"].computed('value', {
      get: function get() {
        var value = _get(this, 'value');
        if (isNone(value)) {
          value = '';
        }
        return value + '@';
      }
    })

  });
});