define('ghost-admin/mixins/style-body', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Mixin = Ember.Mixin;
    var run = Ember.run;
    exports.default = Mixin.create({
        activate: function activate() {
            var cssClasses = this.get('classNames');

            this._super.apply(this, arguments);

            if (cssClasses) {
                run.schedule('afterRender', null, function () {
                    cssClasses.forEach(function (curClass) {
                        $('body').addClass(curClass);
                    });
                });
            }
        },
        deactivate: function deactivate() {
            var cssClasses = this.get('classNames');

            this._super.apply(this, arguments);

            run.schedule('afterRender', null, function () {
                cssClasses.forEach(function (curClass) {
                    $('body').removeClass(curClass);
                });
            });
        }
    });
});