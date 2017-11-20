define('emberx-file-input/components/x-file-input', ['exports', 'ember', 'emberx-file-input/templates/components/x-file-input'], function (exports, _ember, _emberxFileInputTemplatesComponentsXFileInput) {
  exports['default'] = _ember['default'].Component.extend({
    classNameBindings: [':x-file-input', 'disabled:x-file-input--disabled'],
    attributeBindings: ['accept'],
    tagName: 'span',
    layout: _emberxFileInputTemplatesComponentsXFileInput['default'],
    tabindex: 0,

    /**
     * The text displayed when no block is passed.
     *
     * @property alt
     * @default "Upload"
     */
    alt: "Upload",

    /**
     * Listens for change events on the native file input and dispatches
     * the corresponding action up the context chain.
     *
     * @private
     * @method
     * @param {$.Event} e Native change event
     */
    change: function change(e) {
      this.sendAction("action", e.target.files, this.resetInput.bind(this));
    },

    /**
     * Resets the value of the input so you can select the same file
     * multiple times.
     *
     * @method
     */
    resetInput: function resetInput() {
      this.$('.x-file--input').val('');
    },

    /**
     * Generates a random ID to relate the label to the input.
     *
     * @method
     * @private
     */
    randomId: _ember['default'].computed(function () {
      return Math.random().toString(36).substring(7);
    })
  });
});