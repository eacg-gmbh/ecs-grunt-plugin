/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

var bower = require('bower'),
    ScanResult = require("./scanresult.js"),
    debuglog = (require('debuglog'))('ecs-bower-scanner'),
    RestClient = require("./rest-client").RestClient;



exports.Scanner = Scanner;

function Scanner(options) {
    this.options = options;
}

Scanner.prototype.scan = function scan(cb) {
    var self = this;
    var options = this.options;

    bower.commands.list()
        .on('end', function (result) {
            try {
                var dependency = self.walk(result);
                var scan = new ScanResult(
                    options.project,
                    result.pkgMeta.name, 'bower:' + result.pkgMeta.name,
                    dependency);
                debuglog("result: ", JSON.stringify(scan));
                cb(undefined, scan);
            } catch(e) {
                cb(e);
            }
        }).on('error', function(err) {
            debuglog("bower.commands.list - error", err);
            cb(err);
        }).on('log', function(data) {
            debuglog("bower-event-log:", data);
        });
};

Scanner.prototype.transfer = function transfer(scan, cb) {
    var client = new RestClient(this.options);
    client.transfer(scan, cb);
};

Scanner.prototype.walk = function walk(bowerDependency, level) {
    var self = this;
    var opts = this.options || {};
    level = level || 0;

    // Tests missing
    //if(opts && opts.exclude && (opts.exclude instanceof Array && opts.exclude.indexOf(dependency.name) >= 0 || opts.exclude === dependency.name)) {
    //    debuglog("Skipping blacklisted: ", dependency.name);
    //    return dependencies;
    //}

    printDependency(bowerDependency.pkgMeta, level);

    var dependency = new Dependency(bowerDependency.pkgMeta.name,
            bowerDependency.pkgMeta.version, 'bower', bowerDependency.pkgMeta.description,
            bowerDependency.pkgMeta.private, bowerDependency.pkgMeta.license, bowerDependency.pkgMeta.homepage,
            bowerDependency.pkgMeta.repository ? bowerDependency.pkgMeta.repository.url : undefined);

    if(bowerDependency.dependencies) {
        Object.getOwnPropertyNames(bowerDependency.dependencies).forEach(function(val) {
            if (level === 0 && !opts.includeDevDependencies && bowerDependency.devDependencies && bowerDependency.devDependencies[val]) {
                debuglog("Skipping level 0, devDependency: ", val);
            } else {
                var childDependency = bowerDependency.dependencies[val];
                if(childDependency.pkgMeta) {
                    dependency.addDependency(self.walk(childDependency, level + 1));
                } else {
                    if(opts.continueOnMissingDependencies === true) {
                        debuglog("Skipping missing (not installed?) dependency: ", val);
                    } else {
                        throw new Error("Component '" + val +"' missing. Try to execute 'bower install' first");
                    }
                }
            }
        });
    }
    return dependency;
};



function printDependency(pkgMeta, level) {
    level = level || 0;
    var fill = level === 0 ? '' : new Array(level * 4).join(' ');

    debuglog(fill + '-----------------------------------------');
    debuglog(fill + "Name, Version: ", pkgMeta.name, pkgMeta.version);
    debuglog(fill + "License: ", pkgMeta.license);
    debuglog(fill + "Private: ", pkgMeta.private);
    debuglog(fill + "Description: ", pkgMeta.description);
    debuglog(fill + "Homdepage: ", pkgMeta.homepage);
}




