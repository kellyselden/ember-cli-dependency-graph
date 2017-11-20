define('ember-changeset-validations/utils/get-messages', ['exports', 'ember-changeset-validations/utils/messages', 'ember-changeset-validations/utils/with-defaults'], function (exports, _messages, _withDefaults) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getMessages;
  var emberArray = Ember.A,
      isPresent = Ember.isPresent;
  var keys = Object.keys;

  var matchRegex = /validations\/messages$/gi;

  var cachedRef = null;

  /**
   * Find and load messages module on consuming app. Defaults to addon messages.
   * To define a custom message map, create `my-app/app/validations/messages.js`
   * and export an object.
   *
   * @param  {Object} moduleMap
   * @param  {Boolean} useCache Pass `false` to ignore cached key
   * @return {Object}
   */
  function getMessages() {
    var moduleMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requirejs.entries;
    var useCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var messagesModule = _messages.default;

    if (useCache && isPresent(cachedRef)) {
      return cachedRef;
    }

    var moduleKey = emberArray(keys(moduleMap)).find(function (module) {
      return isPresent(module.match(matchRegex));
    });

    if (isPresent(moduleKey)) {
      // Merge the user specified messages with the defaults
      messagesModule = (0, _withDefaults.default)(requireModule(moduleKey).default, messagesModule);
    }

    cachedRef = messagesModule;
    return messagesModule;
  }
});