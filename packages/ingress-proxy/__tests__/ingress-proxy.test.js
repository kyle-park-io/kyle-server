'use strict';

const ingressProxy = require('..');
const assert = require('assert').strict;

assert.strictEqual(ingressProxy(), 'Hello from ingressProxy');
console.info('ingressProxy tests passed');
