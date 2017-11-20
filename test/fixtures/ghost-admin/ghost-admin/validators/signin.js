define('ghost-admin/validators/signin', ['exports', 'ghost-admin/validators/base'], function (exports, _base) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _base.default.create({
        properties: ['identification', 'signin', 'forgotPassword'],
        invalidMessage: 'Email address is not valid',

        identification: function identification(model) {
            var id = model.get('identification');

            if (!validator.empty(id) && !validator.isEmail(id)) {
                model.get('errors').add('identification', this.get('invalidMessage'));
                this.invalidate();
            }
        },
        signin: function signin(model) {
            var id = model.get('identification');
            var password = model.get('password');

            model.get('errors').clear();

            if (validator.empty(id)) {
                model.get('errors').add('identification', 'Please enter an email');
                this.invalidate();
            }

            if (!validator.empty(id) && !validator.isEmail(id)) {
                model.get('errors').add('identification', this.get('invalidMessage'));
                this.invalidate();
            }

            if (validator.empty(password)) {
                model.get('errors').add('password', 'Please enter a password');
                this.invalidate();
            }
        },
        forgotPassword: function forgotPassword(model) {
            var id = model.get('identification');

            model.get('errors').clear();

            if (validator.empty(id) || !validator.isEmail(id)) {
                model.get('errors').add('identification', this.get('invalidMessage'));
                this.invalidate();
            }
        }
    });
});