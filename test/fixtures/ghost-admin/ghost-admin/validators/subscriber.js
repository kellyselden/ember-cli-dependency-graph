define('ghost-admin/validators/subscriber', ['exports', 'ghost-admin/validators/base'], function (exports, _base) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _base.default.create({
        properties: ['email'],

        email: function email(model) {
            var email = model.get('email');

            if (validator.empty(email)) {
                model.get('errors').add('email', 'Please enter an email.');
                model.get('hasValidated').pushObject('email');
                this.invalidate();
            } else if (!validator.isEmail(email)) {
                model.get('errors').add('email', 'Invalid email.');
                model.get('hasValidated').pushObject('email');
                this.invalidate();
            } else if (!validator.isLength(email, 0, 191)) {
                model.get('errors').add('email', 'Email is too long');
                model.get('hasValidated').pushObject('email');
                this.invalidate();
            }
        }
    });
});