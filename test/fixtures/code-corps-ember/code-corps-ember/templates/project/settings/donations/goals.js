define("code-corps-ember/templates/project/settings/donations/goals", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "65M8bsc2", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"donation-goals-activation\",null,[[\"activateDonations\",\"canActivateDonations\"],[[25,\"action\",[[19,0,[]],\"activateDonations\",[19,0,[\"project\"]]],null],[19,0,[\"project\",\"canActivateDonations\"]]]]],false],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"project\",\"donationsActive\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"panel panel--highlighted\"],[7],[0,\"\\n    \"],[6,\"section\"],[7],[0,\"\\n      \"],[6,\"aside\"],[7],[0,\"\\n        \"],[6,\"h3\"],[7],[0,\"Current goal\"],[8],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"Your current fundraising goal.\"],[8],[0,\"\\n      \"],[8],[0,\"\\n\\n      \"],[6,\"section\"],[7],[0,\"\\n        \"],[1,[25,\"donations/donation-progress\",null,[[\"amountDonated\",\"donationGoal\"],[[19,0,[\"project\",\"totalMonthlyDonated\"]],[19,0,[\"project\",\"currentDonationGoal\"]]]]],false],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"panel\"],[7],[0,\"\\n  \"],[6,\"section\"],[7],[0,\"\\n    \"],[6,\"aside\"],[7],[0,\"\\n      \"],[6,\"h3\"],[7],[0,\"Your goals\"],[8],[0,\"\\n      \"],[6,\"p\"],[7],[0,\"Set funding goals for project milestones.\"],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n    \"],[6,\"section\"],[7],[0,\"\\n      \"],[1,[25,\"donation-goals\",null,[[\"add\",\"cancel\",\"edit\",\"project\",\"save\"],[[25,\"action\",[[19,0,[]],\"addDonationGoal\"],null],[25,\"action\",[[19,0,[]],\"cancelDonationGoal\"],null],[25,\"action\",[[19,0,[]],\"editDonationGoal\"],null],[19,0,[\"project\"]],[25,\"action\",[[19,0,[]],\"saveDonationGoal\"],null]]]],false],[0,\"\\n\"],[4,\"if\",[[19,0,[\"error\"]]],null,{\"statements\":[[0,\"        \"],[1,[25,\"error-formatter\",null,[[\"error\"],[[19,0,[\"error\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "code-corps-ember/templates/project/settings/donations/goals.hbs" } });
});