/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

Dependency = require("./dependency");

function ScanResult(user, project, module, moduleId, apiKey, dependencies) {
    this.user = user;
    this.project = project;
    this.module = module;
    this.moduleId = moduleId;
    this.apiKey = apiKey;
    this.dependencies = [];


    if(dependencies instanceof Dependency) {
        this.dependencies.push(dependencies);
    } else if(dependencies instanceof Object) {
        // works also for arrays
        for(var key in dependencies){
            if(dependencies[key] instanceof Dependency) {
                this.dependencies.push(dependencies[key]);
            }
        }
    }
}


module.exports = ScanResult;