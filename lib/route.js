'use strict';

const dispatch = require('./dispatch');

function route(app) {
  app.beforeStart(function* () {
    var config = app.config.eggRpc;
    if (config.enableVersion) {
      for (let version in config.versionDirMapping) {
        let endpoint = app.config.eggRpc.endpoint + '/' + version;
        app.post(endpoint, function* () {
          yield dispatch.call(this, version);
        });
      }
    } else {
      app.post(app.config.eggRpc.endpoint, function* () {
        yield dispatch.call(this);
      });
    }
  });
}



module.exports = route;
