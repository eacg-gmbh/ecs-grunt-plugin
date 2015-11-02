/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

'use strict';
var gulp = require('gulp');
require('gulp-grunt')(gulp);


// run them like any other task
gulp.task('default', [
    'grunt-scan'
    //'grunt-ecs-npm-scan',
    //'grunt-ecs-bower-scan'
]);