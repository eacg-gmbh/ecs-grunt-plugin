/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

'use strict';
var credentials = require((process.env.USERPROFILE || process.env.HOME) + '/.ecsrc.json');

module.exports = function (grunt) {

    grunt.initConfig({

        'ecs-scan': {
            options: {
                npm: {
                    project: 'CodeScanNPM'
                },
                bower:{
                    project: 'CodeScanBower'
                },
                user: credentials.userName,
                apiKey: credentials.apiKey,
                simulate: false,
                baseUrl: 'http://localhost:3000',
                clientOptions: {
                    user: credentials.basicAuth.user,
                    password: credentials.basicAuth.password
                },
                verbose: true

            }
        },
        simplemocha: {
            options: {
                globals: ['assert'],
                timeout: 3000,
                ignoreLeaks: false
                //           ui: 'bdd',
                //           reporter: 'verbose'
            },
            all: {src: ['test/*.js']}
        }
    });

    grunt.loadTasks("./tasks");
    grunt.loadNpmTasks('grunt-simple-mocha');

    grunt.registerTask('scan', ['ecs-scan']);
    grunt.registerTask('test', ['simplemocha']);

    grunt.registerTask('default', ['scan']);
};