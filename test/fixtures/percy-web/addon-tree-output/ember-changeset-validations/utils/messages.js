define('ember-changeset-validations/utils/messages', ['exports', 'ember-validators/messages'], function (exports, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Ember$String = Ember.String,
      dasherize = _Ember$String.dasherize,
      capitalize = _Ember$String.capitalize;


  var assign = Ember.assign || Ember.merge;
  var Messages = assign({}, _messages.default);

  exports.default = assign(Messages, {
    // Blank and present are flipped in ember-validators. Need to flip them back here
    blank: _messages.default.present,
    present: _messages.default.blank,

    getDescriptionFor: function getDescriptionFor() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return capitalize(dasherize(key).split(/[_-]/g).join(' '));
    }
  });
});