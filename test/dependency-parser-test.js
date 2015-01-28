/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

var assert = require("assert"),
    Scanner = require("../tasks/lib/npm-scanner").Scanner,
    Dependency = require("../tasks/lib/dependency");

describe("dependency-parser", function() {

    var child1 = {name: "child1", version: "1.0"};
    var child1b = {name: "child1", version: "1.1.1"};
    var child2 = {name: "child2", version: "1.1", dependencies: {child1: child1b}};
    var devChild = {name: "child3", version: "1.2.2"};

    var data = {
        name: "ecs-grunt-plugin", version: "1.0",
        dependencies: {child1: child1, child2: child2, child3: devChild},
        devDependencies: {child3: '^1.2.0'}
    };

    var dependency = new Scanner({}).walk(data);


    it("should return a dependency, representing root module", function () {
        assert.equal(dependency.name, 'ecs-grunt-plugin');
    });

    it("should return a dependency with child-dependencies which contain child modules, but no dev-dependencies", function () {
        assert.equal(dependency.dependencies.length, 2);
        assert.deepEqual(dependency.versions, ["1.0"]);
        assert(dependency.dependencies.some(function (val) {
            return val.name === 'child1'
        }));
        assert(dependency.dependencies.some(function (val) {
            return val.name === 'child2'
        }));
    });

    it("should return a dependency with child- and grandchild-dependencies, child1 contains 0 and child2 contains 1 grandchilds", function () {
        var child1, child2;
        dependency.dependencies.forEach(function (val) {
            if ("child1" === val.name) child1 = val;
            if ("child2" === val.name) child2 = val;
        });

        assert.equal(child1.dependencies.length, 0);
        assert.deepEqual(child1.versions, ["1.0"]);

        assert.equal(child2.dependencies.length, 1);
        assert.deepEqual(child2.versions, ["1.1"]);
        assert.equal(child2.dependencies[0].name, 'child1');
        assert.deepEqual(child2.dependencies[0].versions, ["1.1.1"]);
    });

    it("should return a dependency list, in which devDependencies are included if configured", function () {
        var dependency = new Scanner({includeDevDependencies: true}).walk(data);

        assert.equal(dependency.dependencies.length, 3);

        var child1, child2, child3;
        dependency.dependencies.forEach(function (val) {
            if ("child1" === val.name) child1 = val;
            if ("child2" === val.name) child2 = val;
            if ("child3" === val.name) child3 = val;
        });

        assert.equal(child1.dependencies.length, 0);
        assert.deepEqual(child1.versions, ["1.0"]);

        assert.equal(child2.dependencies.length, 1);
        assert.deepEqual(child2.versions, ["1.1"]);
        assert.equal(child2.dependencies[0].name, 'child1');
        assert.deepEqual(child2.dependencies[0].versions, ["1.1.1"]);

        assert.equal(child3.dependencies.length, 0);
        assert.deepEqual(child3.versions, ["1.2.2"]);
    });
});