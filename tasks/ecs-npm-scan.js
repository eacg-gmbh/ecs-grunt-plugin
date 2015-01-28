/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

var Scanner;

module.exports = function(grunt) {

    grunt.registerTask("ecs-npm-scan", function() {
        Scanner = Scanner || new require("./lib/npm-scanner").Scanner;

        this.requiresConfig('ecs-npm-scan.options.user', 'ecs-npm-scan.options.project', 'ecs-npm-scan.options.apiKey');

        var options = this.options({
            baseUrl: 'http://localhost:3000',
            includeDevDependencies: false,
            exclude: []
        });

        grunt.log.writeln("ecs-npm-scan: starting, params: " + JSON.stringify(options));

        var done = this.async();
        var scanner = new Scanner(options);
        scanner.scan(function (err, data) {
            if (err) {
                grunt.log.writeln("ecs-npm-scan: error creating scan:" + err.message);
                done(false);
            } else {
                if (options.simulate) {
                    grunt.log.writeln("ecs-npm-scan: simulating, nothing transferred:");
                    done(true);
                } else {
                    scanner.transfer(data, function (err, data) {
                        if (err) {
                            grunt.log.writeln("ecs-npm-scan: error transferring scan:" + err.message);
                            if(data) {
                                grunt.log.writeln("ecs-npm-scan: response data:" + JSON.stringify(data));
                            }
                            done(false);
                        } else {
                            grunt.log.writeln("ecs-npm-scan: successfully created scan on server:" + JSON.stringify(data));
                            done(true);
                        }
                    });
                }
            }
        });
    });
};

