/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

var Client = require('node-rest-client').Client,
    debuglog = (require('debuglog'))('ecs-rest-client');
    pckgJson = require('./../../package.json');

exports.RestClient = RestClient;

function RestClient(options) {
    if(options === undefined) {
        throw new TypeError("Please specify options for rest client");
    } else if(options.baseUrl === undefined) {
        throw new TypeError("Please specify 'baseUrl' attribute in options for rest client");
    }
    this.options = options;
}

RestClient.prototype.transfer = function transfer(scan, cb) {
    var options = this.options;
    debuglog("transfer started, options:", options);

    var client = new Client(options.clientOptions || {});

    var headers = {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': pckgJson.name + '/' + pckgJson.version,
            'X-ApiKey': options.apiKey,
            'X-User': options.user
        },
        data: scan
    };
    client.post(options.baseUrl + "/api/v1/scans", headers, function (data, response) {
        if (response && response.statusCode === 201) {
            cb(null, data);
        } else {
            cb({message: "unexpected response: " + response.statusCode}, data);
        }
    }).on('error', function(err) {
        debuglog("Error callback:", err);
        cb(new Error("error during post: " + err.code));
    }).on('requestTimeout',function(req){
        debuglog("request has expired");
        req.abort();
        cb(new Error("request expired"));
    }).on('responseTimeout',function(res){
        debuglog("response has expired");
        cb(new Error("response expired"));
    });
};





