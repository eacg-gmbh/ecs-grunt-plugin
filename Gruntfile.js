/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

'use strict';

module.exports = function (grunt) {
    var clientOptions = {
        user: "<%= credentials['clientOptions.user'] %>",
        password: "<%= credentials['clientOptions.password'] %>"
    };

    grunt.initConfig({
//        credentials: grunt.file.readJSON('./.ecsrc.json'),

        properties: {
            credentials: './.ecsrc.properties'
        },

        'ecs-npm-scan': {
            options: {
                project: 'CodeScanNPM',
                user: '<%= credentials.user %>',
                apiKey: '<%= credentials.apiKey %>',
                simulate: false,
                baseUrl: '<%= credentials.baseUrl %>',
                includeDevDependencies: false,
                exclude: "bower",
                clientOptions: clientOptions
            }
        },
        'ecs-bower-scan': {
            options: {
                project: 'CodeScanBower',
                user: '<%= credentials.user %>',
                apiKey: '<%= credentials.apiKey %>',
                baseUrl: '<%= credentials.baseUrl %>',
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

//    grunt.registerTask('scan', ['properties', 'ecs-npm-scan', 'ecs-bower-scan']);
    grunt.registerTask('scan', ['properties', 'ecs-bower-scan']);
    grunt.registerTask('test', ['simplemocha']);

    grunt.registerTask('default', ['test', 'scan']);
};