define('code-corps-ember/mixins/contains-code', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Mixin = Ember.Mixin;
  exports.default = Mixin.create({

    /**
     * returns whether or not the `body` property contains `code` tags
     *
     * @property containsCode
     * @type Boolean
     */
    containsCode: computed('body', function () {
      var body = this.get('body');
      if (body) {
        return body.indexOf('<code>') !== -1;
      }
      return false;
    })
  });
});