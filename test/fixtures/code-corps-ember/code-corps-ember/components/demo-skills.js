define('code-corps-ember/components/demo-skills', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
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
  var CONCURRENCY_TIMEOUT = testing ? 0 : 1000;

  exports.default = Component.extend({
    skills: [{ isLoading: false, title: 'BASIC' }, { isLoading: false, title: 'Copywriting' }, { isLoading: false, title: 'Ember.js' }, { isLoading: false, title: 'HTML' }, { isLoading: false, title: 'Python' }, { isLoading: false, title: 'Rails' }, { isLoading: false, title: 'Ruby' }, { isLoading: false, title: 'SEO' }, { isLoading: false, title: 'Sketch' }, { isLoading: false, title: 'UX Design' }],
    classNames: ['demo-skills'],

    _animateItems: observer('animated', function () {
      var _this = this;

      if (get(this, 'animated')) {
        var skills = get(this, 'skills');
        var indexesToAnimate = [2, 3, 5, 6, 8, 9];

        later(function () {
          indexesToAnimate.forEach(function (index) {
            var skill = skills[index];
            get(_this, '_animateItem').perform(skill);
          });
        }, INIT_DELAY);
      }
    }),

    _animateItem: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(skill) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              set(skill, 'selected', true);
              set(skill, 'isLoading', true);
              later(function () {
                set(skill, 'isLoading', false);
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