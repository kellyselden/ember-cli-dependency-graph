define("travis/templates/components/top-bar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "9/C5Ene6", "block": "{\"symbols\":[\"broadcast\"],\"statements\":[[6,\"div\"],[10,\"class\",[26,[\"topbar \",[25,\"if\",[[19,0,[\"is-open\"]],\"has-autoheight\"],null],\" \",[25,\"if\",[[19,0,[\"showBroadcasts\"]],\"has-autoheight\"],null]]]],[7],[0,\"\\n  \"],[6,\"h1\"],[9,\"id\",\"logo\"],[9,\"class\",\"logo\"],[7],[4,\"link-to\",[\"index\"],null,{\"statements\":[[0,\"Travis CI\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"navigation-toggle\"],[7],[0,\"\\n    \"],[6,\"button\"],[9,\"type\",\"button\"],[9,\"class\",\"tofuburger no-button\"],[3,\"action\",[[19,0,[]],\"toggleBurgerMenu\"]],[7],[0,\"\\n      \"],[1,[25,\"svg-jar\",[\"icon-tofuburger\"],null],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n\"],[4,\"unless\",[[19,0,[\"features\",\"enterpriseVersion\"]]],null,{\"statements\":[[4,\"if\",[[19,0,[\"auth\",\"signedIn\"]]],null,{\"statements\":[[0,\"\\n    \"],[1,[25,\"broadcast-tower\",null,[[\"toggleBroadcasts\",\"status\",\"count\"],[\"toggleBroadcasts\",[19,0,[\"broadcasts\",\"lastBroadcastStatus\"]],[19,0,[\"broadcasts\",\"length\"]]]]],false],[0,\"\\n\\n    \"],[6,\"ul\"],[10,\"class\",[26,[\"broadcasts \",[25,\"if\",[[19,0,[\"showBroadcasts\"]],\"is-open\"],null]]]],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"broadcasts\",\"content\"]]],null,{\"statements\":[[0,\"      \"],[6,\"li\"],[7],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"\\n          \"],[6,\"span\"],[10,\"class\",[26,[\"broadcast-status \",[19,1,[\"category\"]]]]],[10,\"title\",[26,[\"Transmitted on \",[19,1,[\"updated_at\"]]]]],[7],[8],[0,\"\\n          \"],[6,\"span\"],[9,\"class\",\"message\"],[7],[1,[19,1,[\"message\"]],true],[8],[0,\"\\n          \"],[6,\"button\"],[9,\"title\",\"hide this broadcast\"],[9,\"class\",\"broadcast-close no-button\"],[9,\"type\",\"button\"],[3,\"action\",[[19,0,[]],\"markBroadcastAsSeen\",[19,1,[]]]],[7],[0,\"\\n            \"],[1,[25,\"svg-jar\",[\"icon-failed\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"      \"],[6,\"li\"],[7],[6,\"p\"],[7],[0,\"There are no broadcasts\"],[8],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"\\n\"],[6,\"nav\"],[9,\"id\",\"navigation\"],[10,\"class\",[26,[\"navigation \",[25,\"if\",[[19,0,[\"is-open\"]],\"is-open\"],null]]]],[7],[0,\"\\n    \"],[6,\"ul\"],[7],[0,\"\\n      \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"about\"]]]]],[9,\"title\",\"Travis CI team\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"About Us\"],[8],[8],[0,\"\\n\"],[4,\"unless\",[[19,0,[\"features\",\"enterpriseVersion\"]]],null,{\"statements\":[[4,\"unless\",[[19,0,[\"features\",\"proVersion\"]]],null,{\"statements\":[[0,\"        \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"blog\"]]]]],[9,\"title\",\"Travis CI Blog\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"Blog\"],[8],[8],[0,\"\\n        \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"status\"]]]]],[9,\"title\",\"Travis CI Status\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"Status\"],[8],[8],[0,\"\\n        \"],[6,\"li\"],[7],[0,\"\\n          \"],[6,\"span\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"Help\"],[8],[0,\"\\n          \"],[6,\"ul\"],[9,\"class\",\"navigation-nested\"],[7],[0,\"\\n            \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"docs\"]]]]],[9,\"title\",\"Browse our documentation\"],[7],[0,\"Read Our Docs\"],[8],[8],[0,\"\\n            \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"imprint\"]]]]],[9,\"title\",\"Go to the imprint\"],[7],[0,\"Imprint\"],[8],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[19,0,[\"features\",\"proVersion\"]]],null,{\"statements\":[[4,\"unless\",[[19,0,[\"auth\",\"signedIn\"]]],null,{\"statements\":[[0,\"          \"],[6,\"li\"],[7],[6,\"a\"],[9,\"href\",\"/plans\"],[9,\"title\",\"Plans and Prices for Travis CI\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"Plans & Pricing\"],[8],[8],[0,\"\\n          \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"enterprise\"]]]]],[9,\"title\",\"Travis CI for Enterprise\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"Enterprise\"],[8],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"status\"]]]]],[9,\"title\",\"Travis CI Status\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"Status\"],[8],[8],[0,\"\\n          \"],[6,\"li\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"Help\"],[8],[0,\"\\n            \"],[6,\"ul\"],[9,\"class\",\"navigation-nested\"],[7],[0,\"\\n              \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"support\"]]]]],[9,\"title\",\"Email the Travis support team\"],[3,\"action\",[[19,0,[]],\"helpscoutTrigger\"]],[7],[0,\"Email Support\"],[8],[8],[0,\"\\n              \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"docs\"]]]]],[9,\"title\",\"Browse our documentation\"],[7],[0,\"Read Our Docs\"],[8],[8],[0,\"\\n              \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"twitter\"]]]]],[9,\"title\",\"Travis in the Twitter-sphere\"],[7],[0,\"Twitter\"],[8],[8],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"li\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"navigation-anchor\"],[7],[0,\"Legal\"],[8],[0,\"\\n            \"],[6,\"ul\"],[9,\"class\",\"navigation-nested\"],[7],[0,\"\\n              \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[20,[\"config\",\"urls\",\"imprint\"]],null],[9,\"title\",\"Go to the imprint\"],[7],[0,\"Imprint\"],[8],[8],[0,\"\\n              \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[20,[\"config\",\"urls\",\"security\"]],null],[9,\"title\",\"Go to our security statement\"],[7],[0,\"Security\"],[8],[8],[0,\"\\n              \"],[6,\"li\"],[7],[6,\"a\"],[10,\"href\",[20,[\"config\",\"urls\",\"terms\"]],null],[9,\"title\",\"Go to our terms of service\"],[7],[0,\"Terms\"],[8],[8],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]},null],[0,\"\\n      \"],[4,\"if\",[[19,0,[\"deploymentVersion\"]]],null,{\"statements\":[[6,\"li\"],[7],[6,\"span\"],[9,\"class\",\"deployment-version\"],[7],[1,[18,\"deploymentVersion\"],false],[8],[8]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[19,0,[\"auth\",\"signedIn\"]]],null,{\"statements\":[[0,\"        \"],[6,\"li\"],[7],[6,\"a\"],[9,\"class\",\"navigation-anchor\"],[9,\"title\",\"Documentation\"],[10,\"href\",[26,[[20,[\"config\",\"urls\",\"docs\"]]]]],[7],[0,\"Docs\"],[8],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}],[0,\"\\n      \"],[6,\"li\"],[10,\"class\",[26,[[18,\"classProfile\"]]]],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"auth\",\"signedOut\"]]],null,{\"statements\":[[0,\"            \"],[6,\"button\"],[9,\"class\",\"auth-button signed-out\"],[9,\"type\",\"button\"],[3,\"action\",[[19,0,[]],\"signIn\"]],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"label-align\"],[7],[0,\"Sign in with GitHub\"],[8],[0,\"\\n                \"],[1,[25,\"svg-jar\",[\"icon-github-white\"],[[\"class\"],[\"icon white\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"auth\",\"signedIn\"]]],null,{\"statements\":[[4,\"link-to\",[\"account\",[19,0,[\"user\",\"login\"]],[25,\"query-params\",null,[[\"offset\"],[0]]]],[[\"class\"],[\"navigation-anchor signed-in\"]],{\"statements\":[[0,\"            \"],[1,[18,\"userName\"],false],[0,\"\\n            \"],[1,[25,\"user-avatar\",null,[[\"url\",\"name\",\"size\"],[[19,0,[\"user\",\"avatarUrl\"]],[19,0,[\"user\",\"fullName\"]],40]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"auth\",\"signingIn\"]]],null,{\"statements\":[[0,\"          \"],[6,\"button\"],[9,\"class\",\"auth-button signing-in\"],[9,\"type\",\"button\"],[7],[0,\"Signing In \"],[1,[25,\"loading-indicator\",null,[[\"inline\"],[true]]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"auth\",\"signedIn\"]]],null,{\"statements\":[[0,\"          \"],[6,\"ul\"],[9,\"class\",\"navigation-nested\"],[7],[0,\"\\n            \"],[6,\"li\"],[7],[0,\"\\n              \"],[4,\"link-to\",[\"account\",[19,0,[\"user\",\"login\"]],[25,\"query-params\",null,[[\"offset\"],[0]]]],[[\"class\",\"title\"],[\"signed-in\",\"See the Travis accounts you belong to\"]],{\"statements\":[[0,\"Accounts\"]],\"parameters\":[]},null],[0,\"\\n            \"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"config\",\"billingEndpoint\"]]],null,{\"statements\":[[4,\"unless\",[[19,0,[\"features\",\"enterpriseVersion\"]]],null,{\"statements\":[[0,\"                \"],[6,\"li\"],[7],[0,\"\\n                  \"],[6,\"a\"],[10,\"href\",[20,[\"config\",\"billingEndpoint\"]],null],[9,\"title\",\"Take a look at your subscriptions\"],[7],[0,\"Billing\"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"            \"],[6,\"li\"],[7],[0,\"\\n              \"],[6,\"a\"],[9,\"href\",\"/\"],[9,\"title\",\"Sign out of Travis\"],[3,\"action\",[[19,0,[]],\"signOut\"]],[7],[0,\"Sign Out\"],[8],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"showCta\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"cta\"],[7],[0,\"\\n    \"],[6,\"p\"],[9,\"class\",\"row\"],[7],[0,\"\\n      Help make Open Source a better place and start building better software today!\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "travis/templates/components/top-bar.hbs" } });
});