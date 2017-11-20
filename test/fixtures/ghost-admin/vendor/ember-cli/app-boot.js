if (!runningTests) {
  require("ghost-admin/app")["default"].create({"version":"1.17","LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"ghost-admin"});
}
