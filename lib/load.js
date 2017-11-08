'use strict';

const path = require('path');
const fs = require('fs');
const is = require('is-type-of');

function load(app) {
  var config = app.config.eggRpc;
  if (config.enableVersion) {
    for (let version in config.versionDirMapping) {
      let dir = config.rpcDir + config.versionDirMapping[version];
      let property = 'rpc_' + version;
      loadClass(app, property, dir);
    }
  } else {
    loadClass(app, 'rpc', config.rpcDir);
  }
}

function loadClass(app, property, dir) {
  dir = path.join(app.config.baseDir, dir); 
  if (!fs.existsSync(dir)) {
    throw new Error('the rpc path does not exists, path:' + dir);
  }

  app.loader.loadToApp(dir, property, {
    caseStyle: 'lower',
    initializer(obj) {
      if (is.function(obj) && !is.class(obj)) {
        obj = obj(app);
      }
      return wrapClass(obj);
    },
  });
}

function wrapClass(RPC) {
  const keys = Object.getOwnPropertyNames(RPC.prototype);
  const ret = {};
  for (const key of keys) {
    if (key === 'constructor') continue;
    if (key[0] === '_') continue;
    if (is.function(RPC.prototype[key])) {
      ret[key] = methodToMiddleware(RPC, key);
    }
  }
  return ret;

  function methodToMiddleware(RPC, key) {
    return function* (ctx) {
      const rpc = new RPC(ctx);
      const r = rpc[key].call(rpc, ctx.rpc.params);
      if (is.generator(r) || is.promise(r)) {
        yield r;
      }
    };
  }
}

module.exports = load;
