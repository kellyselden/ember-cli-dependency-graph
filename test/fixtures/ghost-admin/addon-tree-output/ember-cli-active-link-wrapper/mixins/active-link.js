define('ember-cli-active-link-wrapper/mixins/active-link', ['exports', 'ember'], function (exports, _ember) {

  // these are not currently editable in Ember
  var transitioningInClass = 'ember-transitioning-in';
  var transitioningOutClass = 'ember-transitioning-out';

  exports['default'] = _ember['default'].Mixin.create({

    classNameBindings: ['_active', '_disabled', '_transitioningIn', '_transitioningOut'],
    linkSelector: 'a.ember-view',

    init: function init() {
      this._super.apply(this, arguments);

      this.set('childLinkViews', _ember['default'].A([]));
    },

    buildChildLinkViews: _ember['default'].on('didInsertElement', function () {
      _ember['default'].run.scheduleOnce('afterRender', this, function () {
        var childLinkSelector = this.get('linkSelector');
        var childLinkElements = this.$(childLinkSelector);
        var viewRegistry = _ember['default'].getOwner(this).lookup('-view-registry:main');

        var childLinkViews = childLinkElements.toArray().map(function (view) {
          return viewRegistry[view.id];
        });

        this.set('childLinkViews', _ember['default'].A(childLinkViews));
      });
    }),

    _transitioningIn: _ember['default'].computed('childLinkViews.@each.transitioningIn', function () {
      if (this.get('childLinkViews').isAny('transitioningIn')) {
        return transitioningInClass;
      }
    }),

    _transitioningOut: _ember['default'].computed('childLinkViews.@each.transitioningOut', function () {
      if (this.get('childLinkViews').isAny('transitioningOut')) {
        return transitioningOutClass;
      }
    }),

    hasActiveLinks: _ember['default'].computed('childLinkViews.@each.active', function () {
      return this.get('childLinkViews').isAny('active');
    }),

    activeClass: _ember['default'].computed('childLinkViews.@each.active', function () {
      var activeLink = this.get('childLinkViews').findBy('active');
      return activeLink ? activeLink.get('active') : 'active';
    }),

    _active: _ember['default'].computed('hasActiveLinks', 'activeClass', function () {
      return this.get('hasActiveLinks') ? this.get('activeClass') : false;
    }),

    allLinksDisabled: _ember['default'].computed('childLinkViews.@each.disabled', function () {
      return !_ember['default'].isEmpty(this.get('childLinkViews')) && this.get('childLinkViews').isEvery('disabled');
    }),

    disabledClass: _ember['default'].computed('childLinkViews.@each.disabled', function () {
      var disabledLink = this.get('childLinkViews').findBy('disabled');
      return disabledLink ? disabledLink.get('disabled') : 'disabled';
    }),

    _disabled: _ember['default'].computed('allLinksDisabled', 'disabledClass', function () {
      return this.get('allLinksDisabled') ? this.get('disabledClass') : false;
    })

  });
});