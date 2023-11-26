'use strict';

const mdToHtml = require('..');
const assert = require('assert').strict;

assert.strictEqual(mdToHtml(), 'Hello from mdToHtml');
console.info('mdToHtml tests passed');
