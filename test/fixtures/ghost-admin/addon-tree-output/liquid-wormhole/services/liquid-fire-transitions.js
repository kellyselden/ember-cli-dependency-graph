define("liquid-wormhole/services/liquid-fire-transitions", ["exports", "liquid-fire/action", "liquid-fire/running-transition", "liquid-fire/transition-map"], function (exports, _action, _runningTransition, _transitionMap) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var wormholeActionMap = new Ember.WeakMap();

  exports.default = _transitionMap.default.extend({
    transitionFor: function transitionFor(conditions) {
      if (conditions.matchContext && conditions.matchContext.helperName === 'liquid-wormhole' || conditions.helperName === 'liquid-wormhole') {

        var versions = conditions.versions;

        conditions.versions = versions.map(function (version) {
          return version.value || version;
        });
        conditions.parentElement = conditions.parentElement.find('.liquid-wormhole-element');
        conditions.firstTime = 'no';

        var rule = this.constraintsFor(conditions).bestMatch(conditions);
        var action = void 0;

        if (rule) {
          if (wormholeActionMap.has(rule)) {
            action = wormholeActionMap.get(rule);
          } else {
            action = new _action.default('wormhole', [{ use: rule.use }]);
            action.validateHandler(this);

            wormholeActionMap.set(rule, action);
          }
        } else {
          action = this.defaultAction();
        }

        return new _runningTransition.default(this, versions, action);
      } else {
        return this._super(conditions);
      }
    }
  });
});