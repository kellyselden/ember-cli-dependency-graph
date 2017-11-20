define('ember-component-inbound-actions/inbound-actions', ['exports', 'ember', 'ember-component-inbound-actions/action-proxy'], function (exports, _ember, _emberComponentInboundActionsActionProxy) {

  var scheduleInAfterRender = /^1\.13|^[2-9]/.test(_ember['default'].VERSION);

  exports['default'] = _ember['default'].Mixin.create({
    _inbound_actions_setup: _ember['default'].on('init', function () {
      var _this = this;

      this._inbound_actions_maybeScheduleInAfterRender(function () {
        var proxy = _emberComponentInboundActionsActionProxy['default'].create({ target: _this });
        _this.set('actionReceiver', proxy);
      });
    }),
    _inbound_actions_maybeScheduleInAfterRender: function _inbound_actions_maybeScheduleInAfterRender(fn) {
      if (scheduleInAfterRender) {
        _ember['default'].run.schedule('afterRender', this, fn);
      } else {
        fn();
      }
    }
  });
});