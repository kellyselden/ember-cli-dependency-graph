define('travis/tests/mirage/mirage.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | mirage');

  QUnit.test('mirage/api-spec.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/api-spec.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/config.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/config.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/account.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/account.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/branch.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/branch.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/broadcast.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/broadcast.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/build.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/build.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/commit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/commit.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/cron.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/cron.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/env-var.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/env-var.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/feature.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/feature.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/hook.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/hook.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/job.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/job.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/log.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/log.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/permissions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/permissions.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/repository.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/repository.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/ssh-key.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/ssh-key.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/stage.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/stage.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/factories/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/factories/user.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/account.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/account.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/branch.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/branch.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/broadcast.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/broadcast.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/build.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/build.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/cache.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/cache.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/commit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/commit.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/cron.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/cron.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/env-var.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/env-var.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/feature.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/feature.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/git-user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/git-user.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/hook.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/hook.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/job.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/job.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/log.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/log.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/permissions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/permissions.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/repository.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/repository.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/settings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/settings.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/ssh-key.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/ssh-key.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/stage.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/stage.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/user.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/scenarios/default.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/scenarios/default.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/application.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/branch.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/branch.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/build.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/build.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/cache.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/cache.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/commit-v3.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/commit-v3.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/commit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/commit.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/cron.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/cron.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/feature.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/feature.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/git-user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/git-user.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/job.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/job.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/owner.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/owner.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/repository.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/repository.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/stage.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/stage.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/user-v3.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/user-v3.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/user.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/v2-job.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/v2-job.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/v2.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/v2.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/v3.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/v3.js should pass ESLint\n\n');
  });
});