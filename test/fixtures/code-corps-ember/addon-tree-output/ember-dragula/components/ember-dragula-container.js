define('ember-dragula/components/ember-dragula-container', ['exports', 'ember'], function (exports, _ember) {
  var Component = _ember['default'].Component;
  var on = _ember['default'].on;
  exports['default'] = Component.extend({

    getDrake: function getDrake() {
      return this.get('parentView.drake') || this.get('drake');
    },

    didUpdateAttrs: function didUpdateAttrs(attrs) {
      this._super.apply(this, arguments);
      if (attrs.oldAttrs && attrs.oldAttrs.drake && attrs.oldAttrs.drake.containers) {
        attrs.oldAttrs.drake.containers.removeObject(this.element);
      }
    },

    didReceiveAttrs: function didReceiveAttrs() {
      var _this = this;

      this._super.apply(this, arguments);
      _ember['default'].run.next(function () {
        var drake = _this.getDrake();
        //if (drake && !drake.containers.contains(this.element)) {
        if (drake) {
          drake.containers.push(_this.element);
        }
      });
    },

    unRegisterFromDrake: on('willDestroyElement', function () {
      var drake = this.getDrake();
      if (drake && drake.containers) {
        drake.containers.removeObject(this.element);
      }
    })
  });
});