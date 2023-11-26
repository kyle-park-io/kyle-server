'use strict';

const blogBackend = require('..');
const assert = require('assert').strict;

assert.strictEqual(blogBackend(), 'Hello from blogBackend');
console.info('blogBackend tests passed');
