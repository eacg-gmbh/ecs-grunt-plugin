/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

var Scanner;

module.exports = function(grunt) {

    grunt.registerTask("ecs-bower-scan", function() {
        Scanner = Scanner || new require("./lib/bower-scanner").Scanner;
        this.requiresConfig('ecs-bower-scan.options.user', 'ecs-bower-scan.options.project', 'ecs-bower-scan.options.apiKey');

        var options = this.options({
            baseUrl: 'http://localhost:3000',
            includeDevDependencies: false,
            exclude: []
        });

        grunt.log.writeln("ecs-bower-scan: starting, params: " + JSON.stringify(options));
        var done = this.async();
        var scanner = new Scanner(options);
        scanner.scan(function (err, data) {
            if (err) {
                grunt.log.error("ecs-bower-scan: error creating scan: " + err.message);
                done(false);
            } else {
                if (options.simulate) {
                    grunt.log.writeln("ecs-bower-scan: simulating, nothing transferred:");
                    done(true);
                } else {
                    scanner.transfer(data, function (err, data) {
                        if (err) {
                            grunt.log.error("ecs-bower-scan: error transferring scan:" + err.message);
                            done(false);
                        } else {
                            grunt.log.writeln("ecs-bower-scan: successfully created scan on server:" + JSON.stringify(data));
                            done(true);
                        }
                    });
                }
            }
        });
    });
};

