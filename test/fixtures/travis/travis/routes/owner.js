define('travis/routes/owner', ['exports', 'travis/routes/basic', 'travis/config/environment', 'ember-decorators/service'], function (exports, _basic, _environment, _service) {
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

  var _desc, _value, _obj, _init;

  var $ = Ember.$;
  exports.default = _basic.default.extend((_obj = { auth: null,
    deactivate: function deactivate() {
      return this.controllerFor('loading').set('layoutName', null);
    },
    model: function model(params) {
      var options = {
        headers: {
          'Travis-API-Version': '3'
        }
      };
      if (this.get('auth.signedIn')) {
        options.headers.Authorization = 'token ' + this.auth.token();
      }
      var owner = params.owner;
      var apiEndpoint = _environment.default.apiEndpoint;

      var includes = '?include=organization.repositories,repository.default_branch,build.commit';
      var url = apiEndpoint + '/owner/' + owner + includes;
      return $.ajax(url, options);
    },
    renderTemplate: function renderTemplate() {
      $('body').attr('id', 'owner');
      this._super.apply(this, arguments);
    },


    actions: {
      error: function error(_error) /* transition, originRoute*/{
        var is404 = _error.status === 404;

        if (!is404) {
          var message = 'There was an error while loading data, please try again.';
          this.controllerFor('error').set('layoutName', 'simple');
          this.controllerFor('error').set('message', message);
          return true;
        } else {
          _error.ownerName = this.paramsFor('owner').owner;
          return true;
        }
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});