define('ghost-admin/adapters/setting', ['exports', 'ghost-admin/adapters/application'], function (exports, _application) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
                value: true
        });
        exports.default = _application.default.extend({
                updateRecord: function updateRecord(store, type, record) {
                        var data = {};
                        var serializer = store.serializerFor(type.modelName);

                        // remove the fake id that we added onto the model.
                        delete record.id;

                        // use the SettingSerializer to transform the model back into
                        // an array of settings objects like the API expects
                        serializer.serializeIntoHash(data, type, record);

                        // use the ApplicationAdapter's buildURL method but do not
                        // pass in an id.
                        return this.ajax(this.buildURL(type.modelName), 'PUT', { data: data });
                }
        });
});