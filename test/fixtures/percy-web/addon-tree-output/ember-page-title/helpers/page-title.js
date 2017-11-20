define('ember-page-title/helpers/page-title', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get,
      set = Ember.set,
      guidFor = Ember.guidFor,
      merge = Ember.merge,
      getOwner = Ember.getOwner;


  function updateTitle(tokens) {
    set(this, 'title', tokens.toString());
  }

  exports.default = Ember.Helper.extend({
    pageTitleList: Ember.inject.service(),
    headData: Ember.inject.service(),

    init: function init() {
      this._super();
      var tokens = get(this, 'pageTitleList');
      tokens.push({ id: guidFor(this) });
    },
    compute: function compute(params, _hash) {
      var tokens = get(this, 'pageTitleList');
      var hash = merge({}, _hash);
      hash.id = guidFor(this);
      hash.title = params.join('');
      tokens.push(hash);
      Ember.run.scheduleOnce('afterRender', get(this, 'headData'), updateTitle, tokens);
      return '';
    },
    destroy: function destroy() {
      var tokens = get(this, 'pageTitleList');
      var id = guidFor(this);
      tokens.remove(id);

      var router = getOwner(this).lookup('router:main');
      var routes = router._routerMicrolib || router.router;

      var _ref = routes || {},
          activeTransition = _ref.activeTransition;

      var headData = get(this, 'headData');
      if (activeTransition) {
        activeTransition.promise.finally(function () {
          if (headData.isDestroyed) {
            return;
          }
          Ember.run.scheduleOnce('afterRender', headData, updateTitle, tokens);
        });
      } else {
        Ember.run.scheduleOnce('afterRender', headData, updateTitle, tokens);
      }
    }
  });
});