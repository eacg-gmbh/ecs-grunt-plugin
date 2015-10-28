/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

var assert = require("assert"),
    Dependency = require("../tasks/lib/dependency"),
    ScanResult = require("../tasks/lib/scanresult");


describe('ScanResult', function() {
    describe('Constructor', function () {
        it('should handle dependencies as array', function () {
            var root1 = new Dependency("root1", "1.1", "---"),
                root2 = new Dependency("root2", "2.0", "---"),
                child1 = new Dependency("child1", "1.0", "---"),
                deps = [root1, root2],
                scanResult = new ScanResult("project", "module", "moduleId", deps);

            root1.addDependency(child1);

            assert.equal(scanResult.dependencies.length, 2);
            assert.equal(scanResult.dependencies[0], root1);
            assert.equal(scanResult.dependencies[1], root2);
            assert.equal(scanResult.dependencies[0].dependencies[0], child1);
        });

        it('should handle dependencies as hash', function () {
            var deps = {root1: new Dependency("root1", "1.1", "---"), root2: new Dependency("root2", "2.0", "---")};
            deps.root1.addDependency(new Dependency("child1", "1.0.0", "---"));
            var scanResult = new ScanResult("project", "module", "moduleId", deps);

            assert.equal(scanResult.dependencies.length, 2);
            assert.equal(scanResult.dependencies[0].name, "root1");
            assert.equal(scanResult.dependencies[1].name, "root2");
            assert.equal(scanResult.dependencies[0].dependencies[0].name, "child1");
        });
    });
});

