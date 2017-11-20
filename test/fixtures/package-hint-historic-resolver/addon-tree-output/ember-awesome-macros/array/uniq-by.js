define('ember-awesome-macros/array/uniq-by', ['exports', 'ember-awesome-macros/array/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var emberA = Ember.A;
  var get = Ember.get;
  var guidFor = Ember.guidFor;
  exports.default = (0, _utils.normalizeArray3)({
    firstDefault: function firstDefault() {
      return [];
    },
    func: function func(array, key) {
      if (!array.uniqBy) {
        // TODO: polyfill this
        // from https://github.com/emberjs/ember.js/blob/v2.11.0/packages/ember-runtime/lib/mixins/enumerable.js#L1094-L1105
        var ret = emberA();
        var seen = Object.create(null);

        array.forEach(function (item) {
          var guid = guidFor(get(item, key));
          if (!(guid in seen)) {
            seen[guid] = true;
            ret.push(item);
          }
        });

        return ret;
      }

      return array.uniqBy(key);
    }
  });
});