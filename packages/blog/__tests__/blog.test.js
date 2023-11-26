'use strict';

const blog = require('..');
const assert = require('assert').strict;

assert.strictEqual(blog(), 'Hello from blog');
console.info('blog tests passed');
