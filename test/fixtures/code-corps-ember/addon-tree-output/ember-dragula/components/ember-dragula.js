define('ember-dragula/components/ember-dragula', ['exports', 'ember'], function (exports, _ember) {
    var Component = _ember['default'].Component;
    var on = _ember['default'].on;
    exports['default'] = Component.extend({

        drake: null,

        destroyDrake: function destroyDrake() {
            var drake = this.get('drake');
            if (drake) {
                if (this.element) {
                    drake.containers.removeObject(this.element);
                }
                drake.destroy();
            }
        },

        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);
            this.destroyDrake();
            var options = this.get('config.options') || {};
            this.set('drake', window.dragula(options));
            this.setEventListeners();
        },

        setEventListeners: function setEventListeners() {
            var _this = this;

            if (!this.get('config.enabledEvents')) {
                return;
            }
            this.get('config.enabledEvents').forEach(function (eventName) {
                _this.get('drake').on(eventName, function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    _this.sendAction.apply(_this, [eventName].concat(args));
                });
            });
        },

        cleanupDrake: on('willDestroyElement', function () {
            this.destroyDrake();
            this.set('drake', null);
        })
    });
});