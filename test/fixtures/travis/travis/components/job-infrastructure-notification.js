define('travis/components/job-infrastructure-notification', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed', 'moment'], function (exports, _object, _computed, _moment) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6;

  var Component = Ember.Component;


  var NOVEMBER_2016_RETIREMENT = '2016-11-28T12:00:00-08:00';
  var JANUARY_2017_RETIREMENT = '2017-01-20T12:00:00-08:00';
  var LATEST_TRUSTY_RELEASE = '2017-07-12T18:00:00-00:00';

  exports.default = Component.extend((_dec = (0, _computed.alias)('job.queue'), _dec2 = (0, _computed.alias)('job.config'), _dec3 = (0, _object.computed)('job.isFinished'), _dec4 = (0, _computed.equal)('queue', 'builds.linux'), _dec5 = (0, _computed.equal)('queue', 'builds.ec2'), _dec6 = (0, _object.computed)('job.startedAt', 'job.config'), _dec7 = (0, _computed.equal)('queue', 'builds.macstadium6'), _dec8 = (0, _object.computed)('queue', 'job.config'), _dec9 = (0, _computed.alias)('jobConfig.osx_image'), _dec10 = (0, _object.computed)('isMacStadium6', 'macOSImage'), _dec11 = (0, _object.computed)('job.startedAt', 'macOSImage', 'job.isFinished', 'conjugatedRun', 'isDeprecatedOrRetiredMacImage'), (_obj = { queue: null,
    jobConfig: null,

    conjugatedRun: function conjugatedRun(isFinished) {
      return isFinished ? 'ran' : 'is running';
    },
    isLegacyInfrastructure: null,
    isTrustySudoFalse: null,

    isTrustyStable: function isTrustyStable(startedAt) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (config.dist === 'trusty' && config.group === 'stable') {
        var jobRanAfterReleaseDate = Date.parse(startedAt) > Date.parse(LATEST_TRUSTY_RELEASE);
        if (jobRanAfterReleaseDate) {
          return true;
        }
      }

      return false;
    },
    isMacStadium6: null,

    isPreciseEOL: function isPreciseEOL(queue) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (queue === 'builds.gce' && config.dist === 'precise') {
        if (config.language !== 'android') {
          return true;
        }
      }
    },
    macOSImage: null,

    deprecatedXcodeImages: ['beta-xcode6.1', 'beta-xcode6.2', 'beta-xcode6.3', 'xcode7', 'xcode7.1', 'xcode7.2'],

    imageToRetirementDate: {
      'beta-xcode6.1': JANUARY_2017_RETIREMENT,
      'beta-xcode6.2': NOVEMBER_2016_RETIREMENT,
      'beta-xcode6.3': NOVEMBER_2016_RETIREMENT,
      'xcode7': NOVEMBER_2016_RETIREMENT,
      'xcode7.1': NOVEMBER_2016_RETIREMENT,
      'xcode7.2': NOVEMBER_2016_RETIREMENT
    },

    imageToNewImage: {
      'beta-xcode6.1': 'xcode7.3',
      'beta-xcode6.2': 'xcode7.3',
      'beta-xcode6.3': 'xcode7.3',
      'xcode7': 'xcode7.3',
      'xcode7.1': 'xcode7.3',
      'xcode7.2': 'xcode7.3'
    },

    newImageStrings: {
      'xcode7.3': 'Xcode 7.3.1',
      'xcode6.4': 'Xcode 6.4'
    },

    isDeprecatedOrRetiredMacImage: function isDeprecatedOrRetiredMacImage(isMacStadium6, macOSImage) {
      return isMacStadium6 && this.get('deprecatedXcodeImages').includes(macOSImage);
    },
    deprecatedOrRetiredMacImageMessage: function deprecatedOrRetiredMacImageMessage(startedAt, image, isFinished, conjugatedRun) {
      var retirementDate = Date.parse(this.get('imageToRetirementDate')[image]);

      var newImage = this.get('imageToNewImage')[image];
      var newImageString = this.get('newImageStrings')[newImage];
      var newImageAnchor = newImageString.replace(' ', '-');
      var newImageURL = 'https://docs.travis-ci.com/user/osx-ci-environment/#' + newImageAnchor;

      var jobRanBeforeRetirementDate = Date.parse(startedAt) < retirementDate;
      var retirementDateIsInTheFuture = retirementDate > new Date();

      var formattedRetirementDate = (0, _moment.default)(retirementDate).format('MMMM D, YYYY');

      var retirementLink = '<a href=\'' + newImageURL + '\'>' + (retirementDateIsInTheFuture ? 'will be retired' : 'was retired') + '\n      on ' + formattedRetirementDate + '</a>';

      var retirementSentence = void 0,
          routingSentence = void 0;

      if (retirementDateIsInTheFuture) {
        retirementSentence = 'This job ' + conjugatedRun + ' on an OS X image that ' + retirementLink + '.';
      } else {
        retirementSentence = '\n        This job ' + (isFinished ? 'was configured to run on' : 'is configured to run on') + '\n        an OS X image that ' + retirementLink + '.';
      }

      if (retirementDateIsInTheFuture) {
        routingSentence = 'After that, it will route to our ' + newImageString + ' infrastructure.';
      } else if (jobRanBeforeRetirementDate) {
        routingSentence = 'New jobs will route to our ' + newImageString + ' infrastructure.';
      } else {
        routingSentence = 'It was routed to our ' + newImageString + ' infrastructure.';
      }

      return retirementSentence + ' ' + routingSentence;
    }
  }, (_applyDecoratedDescriptor(_obj, 'queue', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'queue'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'jobConfig', [_dec2], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'jobConfig'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'conjugatedRun', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'conjugatedRun'), _obj), _applyDecoratedDescriptor(_obj, 'isLegacyInfrastructure', [_dec4], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'isLegacyInfrastructure'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isTrustySudoFalse', [_dec5], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'isTrustySudoFalse'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isTrustyStable', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'isTrustyStable'), _obj), _applyDecoratedDescriptor(_obj, 'isMacStadium6', [_dec7], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'isMacStadium6'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isPreciseEOL', [_dec8], Object.getOwnPropertyDescriptor(_obj, 'isPreciseEOL'), _obj), _applyDecoratedDescriptor(_obj, 'macOSImage', [_dec9], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'macOSImage'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isDeprecatedOrRetiredMacImage', [_dec10], Object.getOwnPropertyDescriptor(_obj, 'isDeprecatedOrRetiredMacImage'), _obj), _applyDecoratedDescriptor(_obj, 'deprecatedOrRetiredMacImageMessage', [_dec11], Object.getOwnPropertyDescriptor(_obj, 'deprecatedOrRetiredMacImageMessage'), _obj)), _obj)));
});