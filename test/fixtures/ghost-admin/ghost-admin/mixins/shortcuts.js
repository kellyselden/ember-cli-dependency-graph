define('ghost-admin/mixins/shortcuts', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    var run = Ember.run;
    var typeOf = Ember.typeOf;


    // Configure KeyMaster to respond to all shortcuts,
    // even inside of
    // input, textarea, and select.
    key.filter = function () {
        return true;
    };

    key.setScope('default');
    /**
     * Only routes can implement shortcuts.
     * If you need to trigger actions on the controller,
     * simply call them with `this.get('controller').send('action')`.
     *
     * To implement shortcuts, add this mixin to your `extend()`,
     * and implement a `shortcuts` hash.
     * In this hash, keys are shortcut combinations and values are route action names.
     *  (see [keymaster docs](https://github.com/madrobby/keymaster/blob/master/README.markdown)),
     *
     * ```javascript
     * shortcuts: {
     *     'ctrl+s, command+s': 'save'
     * }
     * ```
     * For more complex actions, shortcuts can instead have their value
     * be an object like {action, options}
     * ```javascript
     * shortcuts: {
     *      'ctrl+k': {action: 'markdownShortcut', options: 'createLink'}
     * }
     * ```
     * You can set the scope of your shortcut by passing a scope property.
     * ```javascript
     * shortcuts : {
     *   'enter': {action : 'confirmModal', scope: 'modal'}
     * }
     * ```
     * If you don't specify a scope, we use a default scope called "default".
     * To have all your shortcut work in all scopes, give it the scope "all".
     * Find out more at the keymaster docs
     */
    exports.default = Mixin.create({
        registerShortcuts: function registerShortcuts() {
            var _this = this;

            var shortcuts = this.get('shortcuts');

            Object.keys(shortcuts).forEach(function (shortcut) {
                var scope = shortcuts[shortcut].scope || 'default';
                var action = shortcuts[shortcut];
                var options = void 0;

                if (typeOf(action) !== 'string') {
                    options = action.options;
                    action = action.action;
                }

                key(shortcut, scope, function (event) {
                    // stop things like ctrl+s from actually opening a save dialogue
                    event.preventDefault();
                    run(_this, function () {
                        this.send(action, options);
                    });
                });
            });
        },
        removeShortcuts: function removeShortcuts() {
            var shortcuts = this.get('shortcuts');

            Object.keys(shortcuts).forEach(function (shortcut) {
                var scope = shortcuts[shortcut].scope || 'default';
                key.unbind(shortcut, scope);
            });
        }
    });
});