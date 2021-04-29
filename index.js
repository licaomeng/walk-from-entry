#!/usr/bin/env node
'use strict';

const exec = require('./exec');
const args = process.argv.slice(2) || [];
exec(...args);
