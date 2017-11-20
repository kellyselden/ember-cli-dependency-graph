define('torii/bootstrap/torii', ['exports', 'torii/providers/linked-in-oauth2', 'torii/providers/google-oauth2', 'torii/providers/google-oauth2-bearer', 'torii/providers/google-oauth2-bearer-v2', 'torii/providers/facebook-connect', 'torii/providers/facebook-oauth2', 'torii/adapters/application', 'torii/providers/twitter-oauth1', 'torii/providers/github-oauth2', 'torii/providers/azure-ad-oauth2', 'torii/providers/stripe-connect', 'torii/providers/edmodo-connect', 'torii/services/torii', 'torii/services/popup', 'torii/services/iframe'], function (exports, _linkedInOauth, _googleOauth, _googleOauth2Bearer, _googleOauth2BearerV, _facebookConnect, _facebookOauth, _application, _twitterOauth, _githubOauth, _azureAdOauth, _stripeConnect, _edmodoConnect, _torii, _popup, _iframe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (application) {
    application.register('service:torii', _torii.default);

    application.register('torii-provider:linked-in-oauth2', _linkedInOauth.default);
    application.register('torii-provider:google-oauth2', _googleOauth.default);
    application.register('torii-provider:google-oauth2-bearer', _googleOauth2Bearer.default);
    application.register('torii-provider:google-oauth2-bearer-v2', _googleOauth2BearerV.default);
    application.register('torii-provider:facebook-connect', _facebookConnect.default);
    application.register('torii-provider:facebook-oauth2', _facebookOauth.default);
    application.register('torii-provider:twitter', _twitterOauth.default);
    application.register('torii-provider:github-oauth2', _githubOauth.default);
    application.register('torii-provider:azure-ad-oauth2', _azureAdOauth.default);
    application.register('torii-provider:stripe-connect', _stripeConnect.default);
    application.register('torii-provider:edmodo-connect', _edmodoConnect.default);
    application.register('torii-adapter:application', _application.default);

    application.register('torii-service:iframe', _iframe.default);
    application.register('torii-service:popup', _popup.default);
  };
});