'use strict';

const constant = require('./constant');
const dispatch = require('./dispatch');

function route(app) {
  app.beforeStart(function* () {
    app.post(app.config.eggRpc.endpoint, dispatch);
  });
}

module.exports = route;
