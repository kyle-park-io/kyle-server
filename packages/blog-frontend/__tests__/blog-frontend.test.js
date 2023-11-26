'use strict';

const blogFrontend = require('..');
const assert = require('assert').strict;

assert.strictEqual(blogFrontend(), 'Hello from blogFrontend');
console.info('blogFrontend tests passed');
