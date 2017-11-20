define('travis/components/team-member', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _dec3, _desc, _value, _obj, _init;

  var Component = Ember.Component;


  var countrySentenceOverrides = {
    newzealand: 'New Zealand',
    occupiedcanada: 'occupied Canada',
    uk: 'United Kingdom',
    ukswitzerland: 'UK/Switzerland',
    usa: 'United States of America',
    polandchile: 'Poland and Chile',
    germanycolombia: 'Germany and Colombia'
  };

  function countryToSentence(country) {
    var override = countrySentenceOverrides[country];

    if (override) {
      return override;
    } else {
      return country.capitalize();
    }
  }

  exports.default = Component.extend((_dec = (0, _object.computed)('member.country'), _dec2 = (0, _object.computed)('member.nationality'), _dec3 = (0, _computed.or)('member.countryAlias', 'member.country'), (_obj = {
    tagName: 'li',
    classNames: ['team-member'],

    countrySentence: function countrySentence(country) {
      return countryToSentence(country);
    },
    nationalitySentence: function nationalitySentence(nationality) {
      return countryToSentence(nationality);
    },
    countryOrAlias: null
  }, (_applyDecoratedDescriptor(_obj, 'countrySentence', [_dec], Object.getOwnPropertyDescriptor(_obj, 'countrySentence'), _obj), _applyDecoratedDescriptor(_obj, 'nationalitySentence', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'nationalitySentence'), _obj), _applyDecoratedDescriptor(_obj, 'countryOrAlias', [_dec3], (_init = Object.getOwnPropertyDescriptor(_obj, 'countryOrAlias'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj)));
});