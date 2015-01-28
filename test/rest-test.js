/*
 * Copyright (c) 2015. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 */

var assert = require("assert"),
    nock = require('nock'),
    RestClient = require("../tasks/lib/rest-client").RestClient;

    var baseUrl = "http://localhost:3000";

describe('RestClient', function() {

    describe("Constructor", function() {
        it('should throw Error if no options defined', function () {
            assert.throws(function() {

                var restClient = new RestClient();
            }, TypeError);
        });
        it('should throw Error if no baseUrl attribute defined', function () {
            assert.throws(function() {

                var restClient = new RestClient({});
            }, TypeError);
        });
        it('should accept baseUrl attribute', function () {
            assert.doesNotThrow(function() {
                var restClient = new RestClient({baseUrl: baseUrl});
                assert.notEqual(restClient, undefined);
            });
        });
    });

    describe("transfer method", function() {

        var restClient;

        beforeEach(function() {
            restClient = new RestClient({baseUrl: "http://localhost:3000"});
        });

        it("should call callback with response data if no error orccurs", function(done) {
            var scope = nock(baseUrl, {
                reqheaders: {
                    'Content-Type': 'application/json'
                }
            }).post('/api/v1/scans').reply(201, "Test response");

            restClient.transfer({}, function(err, data){
                assert.equal(err, null);
                assert.equal(data, "Test response");
                done();
            });
        });

        it("response should be parsed as json object, if 'content-type': 'application/json'", function(done) {
            var scope = nock(baseUrl, {
                reqheaders: {
                    'Content-Type': 'application/json'
                }
            }).defaultReplyHeaders({
                'Content-Type': 'application/json'
            }).post('/api/v1/scans').reply(201, '{"bli": "blub"}');

            restClient.transfer({}, function(err, data){
                assert.equal(err, null);
                assert.deepEqual(data, {bli: "blub"});
                done();
            });
        });
    });
});
