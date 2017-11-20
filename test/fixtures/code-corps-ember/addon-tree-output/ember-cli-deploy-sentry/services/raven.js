define('ember-cli-deploy-sentry/services/raven', ['exports', 'ember', 'ember-cli-sentry/services/raven'], function (exports, _ember, _emberCliSentryServicesRaven) {
    exports['default'] = _emberCliSentryServicesRaven['default'].extend({
        releaseMetaName: 'sentry:revision',
        release: _ember['default'].computed('releaseMetaName', {
            get: function get() {
                return _ember['default'].$('meta[name=\'' + this.get('releaseMetaName') + '\']').attr('content');
            }
        })
    });
});