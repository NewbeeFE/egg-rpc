'use strict';

module.exports = () => {
  const config = {};

  config.security = {
    csrf: {
      ignoreJSON: true,
    },
  }; 

  config.eggRpc = {
    endpoint: '/rpc.endpoint'
  };
  
  return config;
};
