define('ember-modal-dialog/components/modal-dialog', ['exports', 'ember-modal-dialog/templates/components/modal-dialog'], function (exports, _modalDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      inject = Ember.inject,
      isEmpty = Ember.isEmpty,
      isNone = Ember.isNone;
  var dasherize = Ember.String.dasherize;


  var VALID_OVERLAY_POSITIONS = ['parent', 'sibling'];

  function deprecateImplicitAnimatableWithLiquidTetherPresent() {
    (true && !(false) && Ember.deprecate('Rendering modal-dialog with a tetherTarget and liquid-tether installed, and NOT explicitly specifying `animatable` will change behavior in 3.0.0 to use liquid-tether. Pass `animatable=false` to maintain current behavior and remove this message.', false, { id: 'ember-modal-dialog.implicit-animatable', until: '3.0.0' }));
  }

  function deprecateImplicitAnimatableWithLiquidWormholePresent() {
    (true && !(false) && Ember.deprecate('Rendering modal-dialog with liquid-wormhole installed, and NOT explicitly specifying `animatable` will change behavior in 3.0.0 to use liquid-wormhole. Pass `animatable=false` to maintain current behavior and remove this message.', false, { id: 'ember-modal-dialog.implicit-animatable', until: '3.0.0' }));
  }

  exports.default = Ember.Component.extend({
    tagName: '',
    layout: _modalDialog.default,
    modalService: inject.service('modal-dialog'),
    destinationElementId: computed.oneWay('modalService.destinationElementId'),
    modalDialogComponentName: computed('renderInPlace', 'tetherTarget', 'animatable', 'hasLiquidWormhole', 'hasLiquidTether', function () {
      var tetherTarget = this.get('tetherTarget');
      var hasLiquidTether = this.get('hasLiquidTether');
      var hasLiquidWormhole = this.get('hasLiquidWormhole');
      var animatable = this.get('animatable');

      if (this.get('renderInPlace')) {
        return 'ember-modal-dialog/-in-place-dialog';
      } else if (tetherTarget && hasLiquidTether && hasLiquidWormhole && isNone(animatable)) {
        deprecateImplicitAnimatableWithLiquidTetherPresent();
        this.ensureEmberTetherPresent();
        return 'ember-modal-dialog/-tether-dialog';
      } else if (tetherTarget && hasLiquidTether && hasLiquidWormhole && animatable === true) {
        return 'ember-modal-dialog/-liquid-tether-dialog';
      } else if (tetherTarget) {
        this.ensureEmberTetherPresent();
        return 'ember-modal-dialog/-tether-dialog';
      } else if (hasLiquidWormhole && isNone(animatable)) {
        deprecateImplicitAnimatableWithLiquidWormholePresent();
        return 'ember-modal-dialog/-basic-dialog';
      } else if (hasLiquidWormhole && animatable === true) {
        return 'ember-modal-dialog/-liquid-dialog';
      }
      return 'ember-modal-dialog/-basic-dialog';
    }),
    animatable: null,
    hasLiquidWormhole: computed.readOnly('modalService.hasLiquidWormhole'),
    hasLiquidTether: computed.readOnly('modalService.hasLiquidTether'),

    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      if (true) {
        this.validateProps();
      }
    },
    validateProps: function validateProps() {
      var overlayPosition = this.get('overlayPosition');
      if (VALID_OVERLAY_POSITIONS.indexOf(overlayPosition) === -1) {
        (true && Ember.warn('overlayPosition value \'' + overlayPosition + '\' is not valid (valid values [' + VALID_OVERLAY_POSITIONS.join(', ') + '])', false, { id: 'ember-modal-dialog.validate-overlay-position' }));
      }
    },

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

    hasOverlay: true,
    translucentOverlay: false,
    overlayPosition: 'parent', // `parent` or `sibling`
    clickOutsideToClose: false,
    renderInPlace: false,
    tetherTarget: null,
    stack: computed.oneWay('elementId'), // pass a `stack` string to set a "stack" to be passed to liquid-wormhole / liquid-tether
    value: 0, // pass a `value` to set a "value" to be passed to liquid-wormhole / liquid-tether
    target: computed({
      // element, css selector, or view instance
      get: function get() {
        return 'body';
      },
      set: function set(key, value) {
        (true && !(false) && Ember.deprecate('Specifying a `target` on `modal-dialog` is deprecated in favor of padding `tetherTarget`, which will trigger ember-tether usage. Support for `target` will be removed in 3.0.0.', false, { id: 'ember-modal-dialog.modal-dialog-target', until: '3.0.0' }));

        return value;
      }
    }),

    targetAttachment: 'middle center',
    tetherClassPrefix: null,
    attachmentClass: computed('attachment', function () {
      var attachment = this.get('attachment');
      if (isEmpty(attachment)) {
        return;
      }
      return attachment.split(' ').map(function (attachmentPart) {
        return 'emd-attachment-' + dasherize(attachmentPart);
      }).join(' ');
    }),
    targetAttachmentClass: computed('targetAttachment', function () {
      var targetAttachment = this.get('targetAttachment') || '';
      // Convert tether-styled values like 'middle right' to 'right'
      targetAttachment = targetAttachment.split(' ').slice(-1)[0];
      return 'ember-modal-dialog-target-attachment-' + dasherize(targetAttachment) + ' emd-target-attachment-' + dasherize(targetAttachment);
    }),
    ensureEmberTetherPresent: function ensureEmberTetherPresent() {
      if (!this.get('modalService.hasEmberTether')) {
        throw new Error('Please install ember-tether in order to pass a tetherTarget to modal-dialog');
      }
    },

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