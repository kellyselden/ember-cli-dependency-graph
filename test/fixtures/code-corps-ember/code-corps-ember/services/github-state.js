define('code-corps-ember/services/github-state', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var Service = Ember.Service;
  var service = Ember.inject.service;


  /**
   * Converts an integer to a hex string and returns the last two characters
   * as a string.
   *
   * @method integerToHex
   * @param {Integer} integer An integer to convert
   * @return {String} A hexadecimal string of length 2.
   */
  function integerToHex(integer) {
    return ('0' + integer.toString(16)).substr(-2);
  }

  /**
   * Generates a randomized array of decimals, converts them to hexadecimal values
   * and joins into a string in order to output a random string of specified
   * length.
   *
   * @method generateRandomString
   * @param {Integer} length The length of the random string to generate
   * @return {String} A random string of the specified length
   */
  function generateRandomString() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 40;

    var unsignedInt8Array = new window.Uint8Array(length / 2);
    var randomizedArray = window.crypto.getRandomValues(unsignedInt8Array);
    return Array.from(randomizedArray).map(integerToHex).join('');
  }

  /**
   * Service used to protect against cross site request forgery during the
   * GitHub OAuth process.
   *
   * The two methods, `generate()` and `validate(state)` work to initially
   * generate and then later validate a `state` string used in the process.
   *
   * @class GitHubStateService
   * @module code-corps-ember/services/github-state
   * @extends Ember.Service
   * @uses SessionService
   * @public
   */
  exports.default = Service.extend({
    /**
     * We use the injected session service to store the `state` in a way that
     * persists across tabs
     *
     * @property session
     * @type Ember.Service
     * @private
     */
    session: service(),

    /**
     * Generates and returns a random string. The string is also stored into
     * the user's session.
     *
     * This string can then be used as a `state` variable when navigating to
     * GitHub's authorization URL. GitHub will then return it upon succesful
     * approval, so it can be validated using the sibling `validate(state)`
     * function.
     *
     * @method generate
     * @return {String} A randomly generated string, also stored in the
     * user's session.
     * @public
     */
    generate: function generate() {
      var githubState = generateRandomString();
      // session service overrides `set`, so we need to use it directly
      get(this, 'session').set('data.githubState', githubState);
      return githubState;
    },


    /**
     * Validates a state string.
     *
     * Compares the provided string with the string generated by the sibling
     * `generate()` function and stored in the user's session.
     *
     * @method validate
     * @param {String} stateToCheck The string to check if valid
     * @return {Boolean} True if the provided string matches the one stored
     * in the user's session; false otherwise.
     * @public
     */
    validate: function validate(stateToCheck) {
      var state = get(this, 'session.data.githubState');
      return state && state === stateToCheck;
    }
  });
});