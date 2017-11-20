define('travis/utils/paginated-collection-promise', ['exports', 'travis/utils/paginated-collection', 'ember-decorators/object'], function (exports, _paginatedCollection, _object) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _desc, _value, _obj;

  var EmberPromise = Ember.RSVP.Promise;
  var PromiseProxyMixin = Ember.PromiseProxyMixin;
  exports.default = _paginatedCollection.default.extend(PromiseProxyMixin, (_dec = (0, _object.computed)('content'), (_obj = {
    promise: function promise(content) {
      var promise = new EmberPromise(function (resolve, reject) {
        content.then(function (value) {
          resolve(_paginatedCollection.default.create({ content: value }));
        }, function (error) {
          reject(error);
        });
      });
      return promise;
    }
  }, (_applyDecoratedDescriptor(_obj, 'promise', [_dec], Object.getOwnPropertyDescriptor(_obj, 'promise'), _obj)), _obj)));
});