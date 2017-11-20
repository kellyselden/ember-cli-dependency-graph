define('ghost-admin/routes/subscribers/new', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Route = Ember.Route;
    exports.default = Route.extend({
        model: function model() {
            return this.get('store').createRecord('subscriber');
        },
        deactivate: function deactivate() {
            var subscriber = this.controller.get('model');

            this._super.apply(this, arguments);

            if (subscriber.get('isNew')) {
                this.rollbackModel();
            }
        },
        rollbackModel: function rollbackModel() {
            var subscriber = this.controller.get('model');
            subscriber.rollbackAttributes();
        },


        actions: {
            save: function save() {
                var _this = this;

                var subscriber = this.controller.get('model');
                return subscriber.save().then(function (saved) {
                    _this.send('addSubscriber', saved);
                    return saved;
                });
            },
            cancel: function cancel() {
                this.rollbackModel();
                this.transitionTo('subscribers');
            }
        }
    });
});