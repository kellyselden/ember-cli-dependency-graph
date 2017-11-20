define('travis/components/trigger-custom-build', ['exports', 'ember-concurrency', 'npm:yamljs', 'travis/config/environment', 'ember-decorators/service', 'ember-decorators/object/computed'], function (exports, _emberConcurrency, _npmYamljs, _environment, _service, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.filterBy)('repo.branches', 'exists_on_github', true), _dec2 = (0, _computed.notEmpty)('triggerBuildMessage'), (_obj = { ajax: null,
    flashes: null,
    router: null,

    classNames: ['trigger-build-modal'],
    triggerBuildBranch: '',
    triggerBuildMessage: '',
    triggerBuildConfig: '',

    branches: null,
    triggerBuildMessagePresent: null,

    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      this.set('triggerBuildBranch', this.get('repo.defaultBranch.name'));
    },


    createBuild: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var body;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              body = this.buildTriggerRequestBody();
              _context.next = 4;
              return this.get('ajax').postV3('/repo/' + this.get('repo.id') + '/requests', body);

            case 4:
              return _context.abrupt('return', _context.sent);

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);

              this.displayError(_context.t0);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 7]]);
    })),

    triggerBuild: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var data, requestId, triggerBuildRequestDelay;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.get('createBuild').perform();

            case 2:
              data = _context2.sent;

              if (!data) {
                _context2.next = 10;
                break;
              }

              requestId = data.request.id;
              triggerBuildRequestDelay = _environment.default.intervals.triggerBuildRequestDelay;
              _context2.next = 8;
              return (0, _emberConcurrency.timeout)(triggerBuildRequestDelay);

            case 8:
              _context2.next = 10;
              return this.get('showRequestStatus').perform(this.get('repo.id'), requestId);

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })),

    fetchBuildStatus: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(repoId, requestId) {
      var url, headers;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              url = '/repo/' + repoId + '/request/' + requestId;
              headers = {
                'Travis-API-Version': '3'
              };
              _context3.next = 5;
              return this.get('ajax').ajax(url, 'GET', { headers: headers });

            case 5:
              return _context3.abrupt('return', _context3.sent);

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3['catch'](0);

              this.displayError(_context3.t0);

            case 11:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 8]]);
    })),

    showRequestStatus: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(repoId, requestId) {
      var data, result, _data$builds, build;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.get('fetchBuildStatus').perform(repoId, requestId);

            case 2:
              data = _context4.sent;
              result = data.result;
              _data$builds = _slicedToArray(data.builds, 1), build = _data$builds[0];

              if (!(build && result === 'approved')) {
                _context4.next = 9;
                break;
              }

              return _context4.abrupt('return', this.showBuild(build));

            case 9:
              if (!(result === 'rejected')) {
                _context4.next = 11;
                break;
              }

              return _context4.abrupt('return', this.showFailedRequest(requestId));

            case 11:
              return _context4.abrupt('return', this.showProcessingRequest(requestId));

            case 12:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })),

    buildTriggerRequestBody: function buildTriggerRequestBody() {
      var config = _npmYamljs.default.parse(this.get('triggerBuildConfig'));
      var body = {
        request: {
          branch: this.get('triggerBuildBranch'),
          config: config
        }
      };

      if (this.get('triggerBuildMessagePresent')) {
        body.request.message = this.get('triggerBuildMessage');
      }

      return body;
    },
    showProcessingRequest: function showProcessingRequest(requestId) {
      var preamble = 'Hold tight!';
      var notice = 'You successfully triggered a build\n        for ' + this.get('repo.slug') + '. It might take a moment to show up though.';
      this.get('flashes').notice(notice, preamble);
      this.get('onClose')();
      return this.showRequest(requestId);
    },
    showFailedRequest: function showFailedRequest(requestId) {
      var errorMsg = 'You tried to trigger a build\n      for ' + this.get('repo.slug') + ' but the request was rejected.';
      this.get('flashes').error(errorMsg);
      this.get('onClose')();
      return this.showRequest(requestId);
    },
    showRequest: function showRequest(requestId) {
      var queryParams = { requestId: requestId };
      return this.get('router').transitionTo('requests', this.get('repo'), { queryParams: queryParams });
    },
    showBuild: function showBuild(build) {
      this.get('onClose')();
      return this.get('router').transitionTo('build', this.get('repo'), build.id);
    },
    displayError: function displayError(e) {
      var message = void 0;

      if (e.status === 429) {
        message = 'You’ve exceeded the limit for triggering builds, please wait a while before trying again.';
      } else {
        message = 'Oops, something went wrong, please try again.';
      }

      this.get('flashes').error(message);
      return this.get('onClose')();
    },


    actions: {
      toggleTriggerBuildModal: function toggleTriggerBuildModal() {
        this.get('onClose')();
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'router', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'router'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'branches', [_dec], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'branches'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'triggerBuildMessagePresent', [_dec2], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'triggerBuildMessagePresent'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj)), _obj)));
});