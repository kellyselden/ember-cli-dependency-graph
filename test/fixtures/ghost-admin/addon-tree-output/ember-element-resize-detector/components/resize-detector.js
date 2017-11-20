define('ember-element-resize-detector/components/resize-detector', ['exports', 'ember', 'ember-element-resize-detector/templates/components/resize-detector'], function (exports, _ember, _emberElementResizeDetectorTemplatesComponentsResizeDetector) {
  var service = _ember['default'].inject.service;
  var _Ember$run = _ember['default'].run;
  var scheduleOnce = _Ember$run.scheduleOnce;
  var bind = _Ember$run.bind;
  exports['default'] = _ember['default'].Component.extend({
    layout: _emberElementResizeDetectorTemplatesComponentsResizeDetector['default'],
    tagName: '',
    resizeDetector: service(),

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      scheduleOnce('afterRender', this, this.setup);
    },

    setup: function setup() {
      this.callback = bind(this, this.onResize);
      this.get('resizeDetector').setup(this.get('selector'), this.callback);
    },

    teardown: function teardown() {
      this.get('resizeDetector').teardown(this.get('selector'), this.callback);
    },

    onResize: function onResize(element) {
      var $el = _ember['default'].$(element);
      this.sendAction('on-resize', {
        width: $el.width(),
        height: $el.height()
      }, element);
    },

    willDestroyElement: function willDestroyElement() {
      this.teardown();

      this._super.apply(this, arguments);
    }
  }).reopenClass({
    positionalParams: ['selector']
  });
});