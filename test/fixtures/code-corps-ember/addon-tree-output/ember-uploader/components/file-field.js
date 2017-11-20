define('ember-uploader/components/file-field', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend(_ember['default'].Evented, {
    tagName: 'input',
    type: 'file',
    attributeBindings: ['name', 'disabled', 'form', 'type', 'accept', 'autofocus', 'required', 'multiple'],
    multiple: false,
    change: function change(event) {
      var input = event.target;
      if (!_ember['default'].isEmpty(input.files)) {
        this.trigger('filesDidChange', input.files);
      }
    }
  });
});