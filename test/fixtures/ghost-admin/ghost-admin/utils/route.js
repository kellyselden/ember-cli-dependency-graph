define('ghost-admin/utils/route', [], function () {
    'use strict';

    var Route = Ember.Route;


    Route.reopen({
        actions: {
            willTransition: function willTransition(transition) {
                if (this.get('upgradeStatus.isRequired')) {
                    transition.abort();
                    this.get('upgradeStatus').requireUpgrade();
                    return false;
                } else {
                    return true;
                }
            }
        }
    });
});