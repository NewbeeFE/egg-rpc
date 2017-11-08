'use strict';

module.exports = () => {
  const config = {};

  config.security = {
    csrf: {
      ignoreJSON: true,
    },
  };

  config.eggRpc = {
    rpcDir: 'app/rpc',
    endpoint: '/rpc.endpoint',
    enableVersion: false,
    versionDirMapping: {}
  };

  return config;
};
