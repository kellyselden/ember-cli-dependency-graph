define('ember-changeset-validations/utils/validation-errors', ['exports', 'ember-changeset-validations/utils/get-messages'], function (exports, _getMessages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = buildMessage;
  var assert = Ember.assert,
      typeOf = Ember.typeOf,
      get = Ember.get;


  var assign = Ember.assign || Ember.merge;

  function buildMessage(key, result) {
    var messages = (0, _getMessages.default)();
    var description = messages.getDescriptionFor(key);

    if (result.message) {
      return result.message;
    }

    var type = result.type,
        value = result.value,
        _result$context = result.context,
        context = _result$context === undefined ? {} : _result$context;


    if (context.message) {
      var message = context.message;

      if (typeOf(message) === 'function') {
        var builtMessage = message(key, type, value, context);
        assert('Custom message function must return a string', typeOf(builtMessage) === 'string');

        return builtMessage;
      }

      return messages.formatMessage(message, assign({ description: description }, context));
    }

    return messages.formatMessage(get(messages, type), assign({ description: description }, context));
  }
});