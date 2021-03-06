/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

var npm = require("npm"),
    ScanResult = require("./scanresult.js"),
    debuglog = (require('debuglog'))('ecs-npm-scanner'),
    RestClient = require("./rest-client").RestClient;



exports.Scanner = Scanner;

function Scanner(options) {
    this.options = options;
    this.name = 'ecs-npm-scanner';
}

Scanner.prototype.scan = function scan(cb) {
    var self = this;
    var options = this.options;


    npm.load({ parseable: true , long: false}, function (err, npm) {

        if (err) {
            debuglog("npm.load - error: ", err);
            cb(err);
        } else {
            debuglog("npm loaded: prefix = %s", npm.prefix);

            npm.commands.ls([], true, function (err, data) {
                if (err) {
                    debuglog("npm.commands.ls - error:", err);
                    cb(err);
                } else {
                    debuglog("Project: ", data.name, data.version);
                    var dependency = self.walk(data);
                    var scan = new ScanResult(
                        options.project,
                        data.name, 'npm:' + data.name,
                        dependency);
                    debuglog("result: ", JSON.stringify(scan));
                    cb(undefined, scan);
                }
            });
        }
    });
};

Scanner.prototype.transfer = function transfer(scan, cb) {
    var client = new RestClient(this.options);
    client.transfer(scan, cb);
};

Scanner.prototype.walk = function walk(npmDependency, level) {
    var self = this;
    var opts = this.options || {};
    level = level || 0;

    function log() {
        var args = [].slice.call(arguments, 0);
        if(opts.verbose) {
            console.log.apply(this, args);
        } else {
            debuglog.apply(this, args);
        }
    }

    printDependency(npmDependency, level);

    var dependency= new Dependency(npmDependency.name, npmDependency.version, "npm", npmDependency.description, npmDependency.private, npmDependency.licenses || npmDependency.license,
        npmDependency.homepage, npmDependency.repository ? npmDependency.repository.url : undefined);

    if(npmDependency.dependencies) {
        Object.getOwnPropertyNames(npmDependency.dependencies).forEach(function(val) {
            var npmChild = npmDependency.dependencies[val];
            // check for dev dependencies on level 0
            if(level === 0 && !opts.includeDevDependencies && npmDependency.devDependencies && npmDependency.devDependencies[val]) {
                log("Skipping level 0 devDependency: ", val);

            // check for blacklisted dependencies on level 0
            } else if(level === 0 && (opts.exclude instanceof Array && opts.exclude.indexOf(val) >= 0 || opts.exclude === val)) {
                log("Skipping level 0 blacklisted: ", val);
            } else if(npmChild.missing === true) {
                if(npmChild.optional === true) {
                    log("Ignoring missing, optional dependency: ", npmDependency);
                } else {
                    console.log("==== Warning: required dependency '%s' not installed and therefore ignored.", val);
                    console.log("==== Please execute 'npm install' to install the missing component.");
                }
            } else {
                log("Adding dependency, level:", level, val);
                var child = self.walk(npmChild, level + 1);
                if(child) {
                    dependency.addDependency(child);
                }
            }
        });
    }
    return dependency;
};




function printDependency(dep, level) {
    level = level || 0;
    var fill = level === 0 ? '' : new Array(level * 4).join( ' ' );

    debuglog(fill + '-----------------------------------------');
    debuglog(fill + "Name, Version: ", dep.name, dep.version);
    debuglog(fill + "License: ", dep.license || dep.licenses);
    debuglog(fill + "Private: ", dep.private);
    debuglog(fill + "Description: ", dep.description);
    if(dep.repository) {
        debuglog(fill + "Repsitory type:", dep.repository.type);
        debuglog(fill + "Repsitory url:", dep.repository.url);
    }
    debuglog(fill + "Homdepage: ", dep.homepage);
}
