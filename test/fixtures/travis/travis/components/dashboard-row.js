define('travis/components/dashboard-row', ['exports', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _service, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6;

  var later = Ember.run.later;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _service.service)('permissions'), _dec2 = (0, _computed.alias)('repo.currentBuild'), _dec3 = (0, _object.computed)('repo.slug', 'currentBuild.commit.sha'), _dec4 = (0, _computed.alias)('repo.permissions.create_request'), (_obj = { permissionsService: null,
    externalLinks: null,
    ajax: null,
    flashes: null,

    tagName: 'li',
    classNameBindings: ['repo.active:is-active'],
    classNames: ['rows', 'rows--dashboard'],
    isLoading: false,
    isTriggering: false,
    dropupIsOpen: false,

    currentBuild: null,

    urlGitHubCommit: function urlGitHubCommit(slug, sha) {
      return this.get('externalLinks').githubCommit(slug, sha);
    },
    displayMenuTofu: null,

    openDropup: function openDropup() {
      var _this = this;

      this.toggleProperty('dropupIsOpen');
      later(function () {
        _this.set('dropupIsOpen', false);
      }, 4000);
    },
    mouseLeave: function mouseLeave() {
      this.set('dropupIsOpen', false);
    },
    triggerBuild: function triggerBuild() {
      var self = this;
      var data = {};
      data.request = '{ \'branch\': \'' + this.get('repo.defaultBranch.name') + '\' }';

      this.get('ajax').postV3('/repo/' + this.get('repo.id') + '/requests', data).then(function () {
        self.set('isTriggering', false);
        self.get('flashes').success('You\u2019ve successfully triggered a build for ' + self.get('repo.slug') + '.\n                   Hold tight, it might take a moment to show up.');
      });
      this.set('dropupIsOpen', false);
      this.set('isTriggering', true);
    },


    actions: {
      openDropup: function openDropup() {
        this.openDropup();
      },
      triggerBuild: function triggerBuild() {
        this.triggerBuild();
      },
      starRepo: function starRepo() {
        if (this.get('repo.starred')) {
          this.get('unstar').perform(this.get('repo'));
        } else {
          this.get('star').perform(this.get('repo'));
        }
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'permissionsService', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'permissionsService'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentBuild', [_dec2], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'currentBuild'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'urlGitHubCommit', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'urlGitHubCommit'), _obj), _applyDecoratedDescriptor(_obj, 'displayMenuTofu', [_dec4], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'displayMenuTofu'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj)), _obj)));
});