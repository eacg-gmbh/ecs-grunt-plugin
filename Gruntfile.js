/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

'use strict';

module.exports = function (grunt) {
    var clientOptions = {
        user: "<%= credentials['ecs.basicAuth.user'] %>",
        password: "<%= credentials['ecs.basicAuth.password'] %>"
    };

    grunt.initConfig({

        properties: {
//        credentials: grunt.file.readJSON('./.ecsrc.json'),
            credentials: process.env['HOME'] + '/.ecsrc.properties'
        },

        'ecs-npm-scan': {
            options: {
                project: 'CodeScanNPM',
                user: "<%= credentials['ecs.user'] %>",
                apiKey: "<%= credentials['ecs.apiKey'] %>",
                simulate: false,
                baseUrl: "<%= credentials['ecs.baseUrl'] %>",
                includeDevDependencies: false,
                exclude: "bower",
                clientOptions: clientOptions
            }
        },
        'ecs-bower-scan': {
            options: {
                project: 'CodeScanBower',
                user: "<%= credentials['ecs.user'] %>",
                apiKey: "<%= credentials['ecs.apiKey'] %>",
                baseUrl: "<%= credentials['ecs.baseUrl'] %>",
                simulate: false,
                continueOnMissingDependencies: false,
                clientOptions: clientOptions
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
    grunt.loadNpmTasks('grunt-properties-reader');

    grunt.registerTask('scan', ['properties', 'ecs-npm-scan', 'ecs-bower-scan']);
//    grunt.registerTask('scan', ['properties', 'ecs-npm-scan']);
    grunt.registerTask('test', ['simplemocha']);

    grunt.registerTask('default', ['test', 'scan']);
};