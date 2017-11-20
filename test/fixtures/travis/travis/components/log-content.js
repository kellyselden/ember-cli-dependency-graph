define('travis/components/log-content', ['exports', 'travis/utils/lines-selector', 'travis/utils/log', 'travis/utils/log-folder', 'travis/config/environment', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _linesSelector, _log, _logFolder, _environment, _service, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5;

  var scheduleOnce = Ember.run.scheduleOnce;
  var run = Ember.run;
  var schedule = Ember.run.schedule;
  var Component = Ember.Component;
  var $ = Ember.$;


  _log.default.LIMIT = _environment.default.logLimit;

  _log.default.Scroll = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.beforeScroll = options.beforeScroll;
    return this;
  };

  _log.default.Scroll.prototype = $.extend(new _log.default.Listener(), {
    insert: function insert() {
      if (this.numbers) {
        this.tryScroll();
      }
      return true;
    },
    tryScroll: function tryScroll() {
      var ref = void 0;
      var element = $('#log p:visible.highlight:first');
      if (element) {
        if (this.beforeScroll) {
          this.beforeScroll();
        }
        $('#main').scrollTop(0);
        var offset = element.offset();
        var scrollTop = ((ref = offset) != null ? ref.top : void 0) - window.innerHeight / 3;
        return $('html, body').scrollTop(scrollTop);
      }
    }
  });

  _log.default.Limit = function (maxLines, limitedLogCallback) {
    this.maxLines = maxLines || 1000;
    this.limitedLogCallback = limitedLogCallback || function () {};
    return this;
  };

  _log.default.Limit.prototype = _log.default.extend(new _log.default.Listener(), {
    count: 0,
    insert: function insert(log, node) {
      if (node.type === 'paragraph' && !node.hidden) {
        this.count += 1;
        if (this.limited) {
          this.limitedLogCallback();
        }
        return this.count;
      }
    }
  });

  Object.defineProperty(_log.default.Limit.prototype, 'limited', {
    get: function get() {
      return this.count >= this.maxLines;
    }
  });

  exports.default = Component.extend((_dec = (0, _computed.alias)('auth.currentUser'), _dec2 = (0, _object.computed)('log.job.id', 'job.log.token', 'job.repo'), _dec3 = (0, _object.computed)('permissions.all', 'job.repo'), _dec4 = (0, _object.computed)('job', 'job.canRemoveLog', 'hasPermission'), _dec5 = (0, _object.computed)('log.hasContent', 'job.canRemoveLog'), _dec6 = (0, _computed.alias)('showToTop'), (_obj = { auth: null,
    permissions: null,
    externalLinks: null,

    classNameBindings: ['logIsVisible:is-open'],
    logIsVisible: false,

    currentUser: null,

    isShowingRemoveLogModal: false,

    didInsertElement: function didInsertElement() {
      if (this.get('features.debugLogging')) {
        // eslint-disable-next-line
        console.log('log view: did insert');
      }
      this._super.apply(this, arguments);
      scheduleOnce('afterRender', this, 'createEngine');
    },
    willDestroyElement: function willDestroyElement() {
      if (this.get('features.debugLogging')) {
        // eslint-disable-next-line
        console.log('log view: will destroy');
      }
      scheduleOnce('afterRender', this, 'teardownLog');
    },
    teardownLog: function teardownLog(log) {
      var parts = void 0,
          ref = void 0;
      if (log || (log = this.get('log'))) {
        parts = log.get('parts');
        parts.removeArrayObserver(this, {
          didChange: 'partsDidChange',
          willChange: 'noop'
        });
        parts.destroy();
        log.notifyPropertyChange('parts');
        if ((ref = this.lineSelector) != null) {
          ref.willDestroy();
        }
        this.clearLogElement();
      }
    },
    clearLogElement: function clearLogElement() {
      var logElement = this.$('#log');
      if (logElement && logElement[0]) {
        logElement[0].innerHTML = '';
      }
    },
    createEngine: function createEngine(log) {
      var _this = this;

      if (log || (log = this.get('log'))) {
        this.set('limited', false);
        this.clearLogElement();
        log.onClear(function () {
          _this.teardownLog();
          return _this.createEngine();
        });
        this.scroll = new _log.default.Scroll({
          beforeScroll: function beforeScroll() {
            _this.unfoldHighlight();
          }
        });
        this.limit = new _log.default.Limit(_log.default.LIMIT, function () {
          run(function () {
            if (!_this.isDestroying) {
              _this.set('limited', true);
            }
          });
        });
        this.engine = _log.default.create({
          listeners: [this.scroll, this.limit]
        });
        this.engine.limit = this.limit;
        this.logFolder = new _logFolder.default(this.$('#log'));
        this.lineSelector = new _linesSelector.default(this.$('#log'), this.scroll, this.logFolder);
        this.observeParts(log);
      }
    },
    didUpdateAttrs: function didUpdateAttrs() {
      var oldJob = this.get('_oldJob');
      var newJob = this.get('job');

      if (oldJob && oldJob.get('id') != newJob.get('id')) {
        this.teardownLog(oldJob.get('log'));
        return this.createEngine(newJob.get('log'));
      }

      this.set('_oldJob', this.get('job'));
    },
    unfoldHighlight: function unfoldHighlight() {
      return this.lineSelector.unfoldLines();
    },
    observeParts: function observeParts(log) {
      var parts = void 0;
      if (log || (log = this.get('log'))) {
        parts = log.get('parts');
        parts.addArrayObserver(this, {
          didChange: 'partsDidChange',
          willChange: 'noop'
        });
        parts = parts.slice(0);
        this.partsDidChange(parts, 0, null, parts.length);
      }
    },
    partsDidChange: function partsDidChange(parts, start, _, added) {
      schedule('afterRender', this, function () {
        var i = void 0,
            j = void 0,
            len = void 0,
            part = void 0,
            ref = void 0,
            ref1 = void 0,
            ref2 = void 0,
            results = void 0;
        if (this.get('features.debugLogging')) {
          // eslint-disable-next-line
          console.log('log view: parts did change');
        }
        if (this.get('_state') !== 'inDOM') {
          return;
        }
        ref = parts.slice(start, start + added);
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          part = ref[i];
          // My brain can't process this right now.
          // eslint-disable-next-line
          if ((ref1 = this.engine) != null ? (ref2 = ref1.limit) != null ? ref2.limited : void 0 : void 0) {
            break;
          }
          results.push(this.engine.set(part.number, part.content));
        }
        return results;
      });
    },
    plainTextLogUrl: function plainTextLogUrl(id, token, repo) {
      if (id) {
        var url = this.get('externalLinks').plainTextLog(id);
        if (repo.get('private')) {
          url += '&access_token=' + token;
        }
        return url;
      }
    },
    hasPermission: function hasPermission(permissions, repo) {
      return this.get('permissions').hasPermission(repo);
    },
    canRemoveLog: function canRemoveLog(job, _canRemoveLog, hasPermission) {
      if (job) {
        return _canRemoveLog && hasPermission;
      }
    },
    showToTop: function showToTop(hasContent, canRemoveLog) {
      return hasContent && canRemoveLog;
    },
    showTailing: null,

    actions: {
      toTop: function toTop() {
        Travis.tailing.stop();
        return $(window).scrollTop(0);
      },
      toggleTailing: function toggleTailing() {
        Travis.tailing.toggle();
        this.engine.autoCloseFold = !Travis.tailing.isActive();
        return false;
      },
      toggleLog: function toggleLog() {
        this.toggleProperty('logIsVisible');
      },
      toggleRemoveLogModal: function toggleRemoveLogModal() {
        this.toggleProperty('isShowingRemoveLogModal');
      }
    },

    // don't remove this, it's needed as an empty willChange callback
    noop: function noop() {}
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'permissions', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'permissions'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentUser', [_dec], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'currentUser'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'plainTextLogUrl', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'plainTextLogUrl'), _obj), _applyDecoratedDescriptor(_obj, 'hasPermission', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'hasPermission'), _obj), _applyDecoratedDescriptor(_obj, 'canRemoveLog', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'canRemoveLog'), _obj), _applyDecoratedDescriptor(_obj, 'showToTop', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'showToTop'), _obj), _applyDecoratedDescriptor(_obj, 'showTailing', [_dec6], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'showTailing'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj)), _obj)));
});