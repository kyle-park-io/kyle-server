'use strict';

const ingressReverseProxy = require('../lib/ingress-reverse-proxy.js');
const assert = require('assert').strict;

assert.strictEqual(ingressReverseProxy(), 'Hello from ingressReverseProxy');
console.info('ingressReverseProxy tests passed');
