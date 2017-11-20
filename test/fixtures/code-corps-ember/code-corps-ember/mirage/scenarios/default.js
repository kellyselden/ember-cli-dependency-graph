define('code-corps-ember/mirage/scenarios/default', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (server) {

    /*
      Seed your development database using your factories.
      This data will not be loaded in your tests.
       Make sure to define a factory for each model you want to create.
    */

    var categories = [{
      name: 'Arts',
      description: 'You want to improve the arts.'
    }, {
      name: 'Economy',
      description: 'You want to improve finance and the economic climate.'
    }, {
      name: 'Education',
      description: 'You want to improve literacy, schools, and training.'
    }, {
      name: 'Environment',
      description: 'You want to improve your environment.'
    }, {
      name: 'Government',
      description: 'You want to improve government responsiveness.'
    }, {
      name: 'Health',
      description: 'You want to improve prevention and treatment.'
    }, {
      name: 'Justice',
      description: 'You want to improve your judicial system.'
    }, {
      name: 'Politics',
      description: 'You want to improve elections and voting.'
    }, {
      name: 'Public Safety',
      description: 'You want to improve crime prevention and safety.'
    }, {
      name: 'Science',
      description: 'You want to improve tools for advancing science.'
    }, {
      name: 'Security',
      description: 'You want to improve tools like encryption.'
    }, {
      name: 'Society',
      description: 'You want to improve our communities.'
    }, {
      name: 'Technology',
      description: 'You want to improve software tools and infrastructure.'
    }, {
      name: 'Transportation',
      description: 'You want to improve how people travel.'
    }];

    categories.forEach(function (_ref) {
      var name = _ref.name,
          ability = _ref.ability,
          kind = _ref.kind;

      server.create('category', { name: name, ability: ability, kind: kind });
    });

    var roles = [{
      name: 'Accountant',
      ability: 'Accounting',
      kind: 'support'
    }, {
      name: 'Administrator',
      ability: 'Administrative',
      kind: 'support'
    }, {
      name: 'Donor',
      ability: 'Donations',
      kind: 'support'
    }, {
      name: 'Backend Developer',
      ability: 'Backend Development',
      kind: 'technology'
    }, {
      name: 'Data Scientist',
      ability: 'Data Science',
      kind: 'technology'
    }, {
      name: 'Designer',
      ability: 'Design',
      kind: 'creative'
    }, {
      name: 'DevOps',
      ability: 'DevOps',
      kind: 'technology'
    }, {
      name: 'Front End Developer',
      ability: 'Front End Development',
      kind: 'technology'
    }, {
      name: 'Lawyer',
      ability: 'Legal',
      kind: 'support'
    }, {
      name: 'Marketer',
      ability: 'Marketing',
      kind: 'creative'
    }, {
      name: 'Mobile Developer',
      ability: 'Mobile Development',
      kind: 'technology'
    }, {
      name: 'Product Manager',
      ability: 'Product Management',
      kind: 'technology'
    }, {
      name: 'Photographer',
      ability: 'Photography',
      kind: 'creative'
    }, {
      name: 'Researcher',
      ability: 'Research',
      kind: 'support'
    }, {
      name: 'Tester',
      ability: 'Testing',
      kind: 'technology'
    }, {
      name: 'Video Producer',
      ability: 'Video Production',
      kind: 'creative'
    }, {
      name: 'Writer',
      ability: 'Writing',
      kind: 'creative'
    }];

    roles.forEach(function (_ref2) {
      var name = _ref2.name,
          ability = _ref2.ability,
          kind = _ref2.kind;

      server.create('role', { name: name, ability: ability, kind: kind });
    });

    var owner = server.create('user', {
      email: 'owner@codecorps.org',
      githubId: 12345,
      githubUsername: 'codecorps-owner',
      password: 'password',
      username: 'codecorps-owner'
    });

    var organization = server.create('organization', {
      owner: owner,
      description: 'Help build and fund public software projects for social good.',
      name: 'Code Corps',
      slug: 'code-corps'
    });

    server.create('sluggedRoute', {
      slug: organization.slug,
      organization: organization
    });

    var project = server.create('project', {
      description: 'Help build and fund public software projects for social good.',
      organization: organization,
      slug: 'code-corps',
      title: 'Code Corps',
      website: 'https://www.codecorps.org'
    });

    server.create('project-user', { user: owner, project: project, role: 'owner' });

    var admin = server.create('user', {
      email: 'admin@codecorps.org',
      password: 'password',
      username: 'codecorps-admin'
    });

    server.create('project-user', { user: admin, project: project, role: 'admin' });

    var contributor = server.create('user', {
      email: 'contributor@codecorps.org',
      password: 'password',
      username: 'codecorps-contributor'
    });

    server.create('project-user', { user: contributor, project: project, role: 'contributor' });

    var pending = server.create('user', {
      email: 'pending@codecorps.org',
      password: 'password',
      username: 'codecorps-pending'
    });

    server.create('project-user', { user: pending, project: project, role: 'pending' });

    server.create('user', {
      email: 'random@user.com',
      password: 'password',
      username: 'random'
    });

    var connectedInstallation = server.create('github-app-installation', {
      githubAccountAvatarUrl: 'https://avatars0.githubusercontent.com/u/12991115?v=4',
      githubAccountLogin: 'code-corps',
      user: owner
    });

    server.create('organization-github-app-installation', {
      githubAppInstallation: connectedInstallation,
      organization: organization
    });

    server.create('github-repo', {
      githubAppInstallation: connectedInstallation,
      name: 'code-corps-api',
      project: project
    });

    server.create('github-repo', {
      githubAppInstallation: connectedInstallation,
      name: 'code-corps-ember'
    });

    var inboxTaskList = server.create('task-list', {
      name: 'Inbox',
      position: 0,
      project: project
    });

    var backlogTaskList = server.create('task-list', {
      name: 'Backlog',
      position: 1,
      project: project
    });

    var inProgressTaskList = server.create('task-list', {
      name: 'In Progress',
      position: 2,
      project: project
    });

    var doneTaskList = server.create('task-list', {
      name: 'Done',
      position: 3,
      project: project
    });

    server.createList('task', 4, { project: project, taskList: inboxTaskList, user: owner });

    server.createList('task', 5, { project: project, taskList: backlogTaskList, user: owner });

    server.createList('task', 3, { project: project, taskList: inProgressTaskList, user: owner });

    server.createList('task', 2, { project: project, taskList: doneTaskList, user: owner });

    var skillTitles = ['CSS', 'Ember.js', 'HTML'];

    skillTitles.forEach(function (title) {
      var skill = server.create('skill', { title: title });
      server.create('project-skill', { project: project, skill: skill });
    });

    var categoryNames = ['Society', 'Technology'];
    categoryNames.forEach(function (name) {
      var _server$schema$catego = _slicedToArray(server.schema.categories.where({ name: name }).models, 1),
          category = _server$schema$catego[0];

      server.create('project-category', { category: category, project: project });
    });

    project.createStripeConnectPlan();

    server.create('stripe-platform-customer', { user: owner });

    server.create('stripe-platform-card', { user: owner });

    server.create('donation-goal', {
      amount: 1250000,
      current: true,
      description: '\nWe can make regular, ongoing improvements with two full-time developers and one full-time community manager. All our overhead costs (like servers, services, etc) will be completely covered. And most importantly, we\'ll significantly increase the pace of our progress.\n',
      project: project
    });
  };

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
});