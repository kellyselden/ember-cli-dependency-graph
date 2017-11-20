define('ember-cli-flash/components/flash-message', ['exports', 'ember-cli-flash/templates/components/flash-message'], function (exports, _flashMessage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Ember$String = Ember.String,
      classify = _Ember$String.classify,
      htmlSafe = _Ember$String.htmlSafe,
      Component = Ember.Component,
      getWithDefault = Ember.getWithDefault,
      isPresent = Ember.isPresent,
      run = Ember.run,
      on = Ember.on,
      _get = Ember.get,
      set = Ember.set,
      computed = Ember.computed;
  var readOnly = computed.readOnly,
      bool = computed.bool;
  var next = run.next,
      cancel = run.cancel;
  exports.default = Component.extend({
    layout: _flashMessage.default,
    active: false,
    messageStyle: 'bootstrap',
    classNameBindings: ['alertType', 'active', 'exiting'],

    showProgressBar: readOnly('flash.showProgress'),
    exiting: readOnly('flash.exiting'),
    hasBlock: bool('template').readOnly(),

    alertType: computed('flash.type', {
      get: function get() {
        var flashType = getWithDefault(this, 'flash.type', '');
        var messageStyle = getWithDefault(this, 'messageStyle', '');
        var prefix = 'alert alert-';

        if (messageStyle === 'foundation') {
          prefix = 'alert-box ';
        }

        return '' + prefix + flashType;
      }
    }),

    flashType: computed('flash.type', {
      get: function get() {
        var flashType = getWithDefault(this, 'flash.type', '');

        return classify(flashType);
      }
    }),

    _setActive: on('didInsertElement', function () {
      var _this = this;

      var pendingSet = next(this, function () {
        set(_this, 'active', true);
      });
      set(this, 'pendingSet', pendingSet);
    }),

    progressDuration: computed('flash.showProgress', {
      get: function get() {
        if (!_get(this, 'flash.showProgress')) {
          return false;
        }

        var duration = getWithDefault(this, 'flash.timeout', 0);

        return htmlSafe('transition-duration: ' + duration + 'ms');
      }
    }),

    click: function click() {
      var destroyOnClick = getWithDefault(this, 'flash.destroyOnClick', true);

      if (destroyOnClick) {
        this._destroyFlashMessage();
      }
    },
    mouseEnter: function mouseEnter() {
      var flash = _get(this, 'flash');
      if (isPresent(flash)) {
        flash.preventExit();
      }
    },
    mouseLeave: function mouseLeave() {
      var flash = _get(this, 'flash');
      if (isPresent(flash)) {
        flash.allowExit();
      }
    },
    willDestroy: function willDestroy() {
      this._super();
      this._destroyFlashMessage();
      cancel(_get(this, 'pendingSet'));
    },


    // private
    _destroyFlashMessage: function _destroyFlashMessage() {
      var flash = getWithDefault(this, 'flash', false);

      if (flash) {
        flash.destroyMessage();
      }
    },


    actions: {
      close: function close() {
        this._destroyFlashMessage();
      }
    }
  });
});