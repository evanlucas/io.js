'use strict';

const common = require('../common');
const tls = require('tls');
const v8 = require('v8');

const bench = common.createBenchmark(main, {
  type: ['single', 'double'],
  n: [1e6]
});

function main(conf) {
  const type = conf.type;
  const n = conf.n | 0;

  const inputs = {
    single: 'C=US\nST=CA\nL=SF\nO=Joyent\nOU=Node.js\nCN=ca1\n' +
      'emailAddress=ry@clouds.org',
    double: 'OU=Domain Control Validated\nOU=PositiveSSL Wildcard\n' +
      'CN=*.nodejs.org',
  };

  const input = inputs[type];

  tls.parseCertString(input);
  v8.setFlagsFromString('--allow_natives_syntax');
  eval('%OptimizeFunctionOnNextCall(tls.parseCertString)');

  bench.start();
  for (var i = 0; i < n; i++) {
    tls.parseCertString(input);
  }
  bench.end(n);
}
