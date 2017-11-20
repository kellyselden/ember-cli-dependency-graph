define('ember-modal-dialog/components/deprecated-tether-dialog', ['exports', 'ember-modal-dialog/components/basic-dialog', 'ember-modal-dialog/templates/components/deprecated-tether-dialog'], function (exports, _basicDialog, _deprecatedTetherDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dasherize = Ember.String.dasherize;
  var computed = Ember.computed,
      inject = Ember.inject,
      isEmpty = Ember.isEmpty;
  exports.default = _basicDialog.default.extend({
    layout: _deprecatedTetherDialog.default,
    init: function init() {
      this._super.apply(this, arguments);
      (true && !(false) && Ember.deprecate('Direct usage of `tether-dialog` is deprecated in favor of opting into tethering behavior by passing a `tetherTarget` to `modal-dialog`. Will be removed in 3.0.0.', false, { id: 'ember-modal-dialog.tether-dialog', until: '3.0.0' }));
    },

    modalService: inject.service('modal-dialog'),
    destinationElementId: computed.oneWay('modalService.destinationElementId'),

    // onClose - set this from templates
    close: computed('onClose', {
      get: function get() {
        return this.get('onClose');
      },
      set: function set(key, value) {
        (true && !(false) && Ember.deprecate('Specifying the `close` action for a modal-dialog/tether-dialog is deprecated in favor of `onClose`. Will be removed in 3.0.0.', false, { id: 'ember-modal-dialog.close-action', until: '3.0.0' }));

        this.set('onClose', value);
      }
    }),

    // containerClass - set this from templates
    "container-class": computed('containerClass', {
      get: function get() {
        return this.get('containerClass');
      },
      set: function set(key, value) {
        (true && !(false) && Ember.deprecate('Passing `container-class` (kebab-case) is deprecated in favor of `containerClass` (camelCase). Will be removed in 3.0.0.', false, { id: 'ember-modal-dialog.kebab-props', until: '3.0.0' }));

        this.set('containerClass', value);
      }
    }),
    containerClassNames: ['ember-modal-dialog'], // set this in a subclass definition
    containerClassNamesString: computed('containerClassNames.[]', 'targetAttachmentClass', 'attachmentClass', 'containerClass', 'renderInPlace', function () {
      return [this.get('containerClassNames').join(' '), this.get('targetAttachmentClass'), this.get('attachmentClass'), this.get('containerClass'), this.get('renderInPlace') ? 'ember-modal-dialog-in-place emd-in-place' : null].filter(function (className) {
        return !isEmpty(className);
      }).join(' ');
    }),

    // overlayClass - set this from templates
    "overlay-class": computed('overlayClass', {
      get: function get() {
        return this.get('overlayClass');
      },
      set: function set(key, value) {
        (true && !(false) && Ember.deprecate('Passing `overlay-class` (kebab-case) is deprecated in favor of `overlayClass` (camelCase). Will be removed in 3.0.0.', false, { id: 'ember-modal-dialog.kebab-props', until: '3.0.0' }));

        this.set('overlayClass', value);
      }
    }),
    overlayClassNames: ['ember-modal-overlay'], // set this in a subclass definition

    // wrapperClass - set this from templates
    "wrapper-class": computed('wrapperClass', {
      get: function get() {
        return this.get('wrapperClass');
      },
      set: function set(key, value) {
        (true && !(false) && Ember.deprecate('Passing `wrapper-class` (kebab-case) is deprecated in favor of `wrapperClass` (camelCase). Will be removed in 3.0.0.', false, { id: 'ember-modal-dialog.kebab-props', until: '3.0.0' }));

        this.set('wrapperClass', value);
      }
    }),
    wrapperClassNames: ['ember-modal-wrapper'], // set this in a subclass definition

    concatenatedProperties: ['containerClassNames', 'overlayClassNames', 'wrapperClassNames'],

    targetAttachmentClass: computed('targetAttachment', function () {
      var targetAttachment = this.get('targetAttachment') || '';
      return 'ember-modal-dialog-target-attachment-' + dasherize(targetAttachment);
    }),

    targetAttachment: 'middle center',
    attachment: 'middle center',
    hasOverlay: true,
    target: 'viewport', // element, css selector, view instance, 'viewport', or 'scroll-handle'

    tetherClassPrefix: 'ember-tether',
    // offset - passed in
    // targetOffset - passed in
    // targetModifier - passed in

    isIOS: computed(function () {
      return (/iPad|iPhone|iPod/.test(navigator.userAgent)
      );
    }),

    makeOverlayClickableOnIOS: Ember.on('didInsertElement', function () {
      if (this.get('isIOS') && this.get('hasOverlay')) {
        Ember.$('div[data-emd-overlay]').css('cursor', 'pointer');
      }
    }),

    actions: {
      onClose: function onClose() {
        this.sendAction('onClose');
      },
      onClickOverlay: function onClickOverlay(e) {
        e.preventDefault();
        if (this.get('onClickOverlay')) {
          this.sendAction('onClickOverlay');
        } else {
          this.sendAction('onClose');
        }
      }
    }

  });
});