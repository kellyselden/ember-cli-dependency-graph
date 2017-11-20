define('code-corps-ember/components/github-connect', ['exports', 'code-corps-ember/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var set = Ember.set;
  var service = Ember.inject.service;


  var baseUrl = 'https://github.com/login/oauth/authorize';

  /**
    The github-connect component is used to to connect to github
  
    ## default usage
  
    ```handlebars
      {{github-connect state=state}}
    ```
  
    @module Component
    @class github-connect
    @extends Ember.Component
    @public
   */

  exports.default = Component.extend({
    tagName: 'a',
    classNames: ['github-connect', 'button', 'default'],
    attributeBindings: ['url:href', 'target:target'],

    githubState: service(),
    metrics: service(),

    clientId: '' + _environment.default.github.clientId,
    redirectUri: '' + _environment.default.github.redirectUri,
    scope: '' + _environment.default.github.scope,
    state: null,
    target: null,
    url: null,

    init: function init() {
      this._super.apply(this, arguments);
      this._initState();
      this._initUrl();
    },
    click: function click() {
      get(this, 'metrics').trackEvent({
        event: 'Clicked Connect with GitHub'
      });
    },
    _initState: function _initState() {
      var githubState = get(this, 'githubState').generate();
      set(this, 'state', githubState);
    },
    _initUrl: function _initUrl() {
      var _getProperties = this.getProperties('clientId', 'scope', 'state', 'redirectUri'),
          clientId = _getProperties.clientId,
          scope = _getProperties.scope,
          state = _getProperties.state,
          redirectUri = _getProperties.redirectUri;

      set(this, 'url', baseUrl + '?scope=' + scope + '&client_id=' + clientId + '&state=' + state + '&redirect_uri=' + redirectUri);
    }
  });
});