define('code-corps-ember/components/demo-categories', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var later = Ember.run.later;
  var set = Ember.set;
  var get = Ember.get;
  var observer = Ember.observer;
  var testing = Ember.testing;


  var INIT_DELAY = testing ? 0 : 1500;
  var LOADING_TOGGLE = testing ? 0 : 700;
  var CONCURRENCY_TIMEOUT = testing ? 0 : 1500;

  exports.default = Component.extend({
    categories: [{
      description: 'You want to improve government responsiveness.',
      isLoading: false,
      name: 'Government',
      selected: false,
      slug: 'government'
    }, {
      description: 'You want to improve tools for advancing science.',
      isLoading: false,
      name: 'Science',
      selected: false,
      slug: 'science'
    }, {
      description: 'You want to improve software tools and infrastructure.',
      isLoading: false,
      name: 'Technology',
      selected: false,
      slug: 'technology'
    }],
    classNames: ['demo-categories'],

    _animateItems: observer('animated', function () {
      var _this = this;

      if (get(this, 'animated')) {
        var categories = get(this, 'categories');
        var indexesToAnimate = [0, 2];

        later(function () {
          indexesToAnimate.forEach(function (index) {
            var category = categories[index];
            get(_this, '_animateItem').perform(category);
          });
        }, INIT_DELAY);
      }
    }),

    _animateItem: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(category) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              set(category, 'selected', true);
              set(category, 'isLoading', true);
              later(function () {
                set(category, 'isLoading', false);
              }, LOADING_TOGGLE);
              _context.next = 5;
              return (0, _emberConcurrency.timeout)(CONCURRENCY_TIMEOUT);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).enqueue()
  });
});