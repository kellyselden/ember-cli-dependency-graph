define('code-corps-ember/components/modal-confirm', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    /**
      Text for Cancel Button on dialog
      @property cancelText
      @type String
      @default 'Cancel'
    */
    cancelText: 'Cancel',
    /**
      Text for Ok button on dialog
       @property okText
      @type String
      @default 'Ok'
    */
    okText: 'Ok',
    /**
      @property showDialog
      @type Boolean
      @default false
    */
    showDialog: false,

    actions: {
      /**
        Closes dialog
        @method closeDialog
      */
      closeDialog: function closeDialog() {
        get(this, '_hideDialog').perform();
      },


      /**
        Fires okAction closure action if one exists
        and closes the dialog
         @method okAction
      */
      okAction: function okAction() {
        if (this.attrs.okAction) {
          get(this, 'okAction')();
        }
        this.send('closeDialog');
      }
    },

    _hideDialog: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return set(this, 'showDialog', false);

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }))
  });
});