define('travis/services/random-logo', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  exports.default = Service.extend({
    logoVariants: ['Tessa-1', 'Tessa-2', 'Tessa-3', 'Tessa-4', 'Tessa-pride-4', 'Tessa-pride', 'TravisCI-Mascot-1', 'TravisCI-Mascot-2', 'TravisCI-Mascot-3', 'TravisCI-Mascot-4', 'TravisCI-Mascot-pride-4', 'TravisCI-Mascot-pride'],

    init: function init() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this._super(args);
      this.set('logo', this.randomLogo());
    },
    randomLogo: function randomLogo() {
      var logos = this.get('logoVariants');
      return logos[Math.floor(Math.random() * logos.length)];
    }
  });
});