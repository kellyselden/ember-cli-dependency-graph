define('travis/models/stage', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'ember-decorators/object', 'travis/mixins/duration-calculations', 'travis/mixins/duration-attributes'], function (exports, _model, _attr, _relationships, _object, _durationCalculations, _durationAttributes) {
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

  exports.default = _model.default.extend(_durationCalculations.default, _durationAttributes.default, (_dec = (0, _object.computed)('state'), (_obj = {
    number: (0, _attr.default)(),
    name: (0, _attr.default)(),
    state: (0, _attr.default)(),

    build: (0, _relationships.belongsTo)({ async: true }),

    notStarted: function notStarted(state) {
      var waitingStates = ['queued', 'created', 'received'];
      return waitingStates.includes(state);
    }
  }, (_applyDecoratedDescriptor(_obj, 'notStarted', [_dec], Object.getOwnPropertyDescriptor(_obj, 'notStarted'), _obj)), _obj)));
});