'use strict';

const rpcErrorCode = require('../../lib/rpc_error_code');

module.exports = () => {
  return function* (next) {
    if (this.request.url.indexOf(this.app.config.eggRpc.endpoint) === 0) {
      try {
        yield next;
      } catch (err) {
        if (err.name === 'RPC_EXCEPTION_ERROR') {
          return;
        }

        let error;
        if (err.name === 'SyntaxError') {
          error = rpcErrorCode.ParseError;
        } else {
          error = rpcErrorCode.InternalError;
        }

        this.rpc.throw(err, error.code, error.message);
      }
    } else {
      yield next;
    }
  };
};
