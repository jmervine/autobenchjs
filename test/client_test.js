var Client = require('lib/client');

// BEGIN stubs
var sample_results = [
    { requests: 16 },
    { requests: 14 },
    { requests: 20 },
    { requests: 10 }
    // expected median 15
];

var stub_run = 0;

var stub_runSync = function () {
    return sample_results[stub_run++];
};

var stub_run = function (callback) {
    callback(sample_results[stub_run++]);
};

// END stubs
var client;

module.exports = {
    setUp: function (callback) {
        client = new Client("./test/support/script.js", sample_results.length, [ "http://example.com/" ]);
        client.phantomas.run = stub_run;
        client.phantomas.runSync = stub_runSync;
        callback();
    },

    tearDown: function (callback) {
        client = undefined;
        stub_run = 0;
        callback();
    },

    'new Client(config)': function (test) {
        test.expect(6);

        test.ok(client);
        test.ok(client.runs);
        test.ok(client.phantomas);
        test.ok(client.phantomas.script);
        test.ok(client.phantomas.args);
        test.ok(client.phantomas.args.indexOf("http://example.com/") !== -1);

        test.done();
    },

    '#median(set, key)': function (test) {
        test.expect(6);

        test.equal(1, client.median([ { foo: 1 } ], 'foo'));
        test.equal(1.5, client.median([ { foo: 1 },
                                        { foo: 2 } ], 'foo'));

        test.equal(2, client.median([ { foo: 1 },
                                        { foo: 2 },
                                        { foo: 2 }], 'foo'));
        test.equal(2, client.median([ { foo: 3 },
                                        { foo: 1 },
                                        { foo: 2 }], 'foo'));
        test.equal(15, client.median([ { foo: 16 },
                                        { foo: 14 },
                                        { foo: 20 },
                                        { foo: 10 }], 'foo'));
        test.equal(2, client.median([ { foo: 3 },
                                        { foo: 3 },
                                        { foo: 2 },
                                        { foo: 1 },
                                        { foo: 1 }], 'foo'));
        test.done();
    },

    '#median(set)': function (test) {
        test.expect(6);

        test.deepEqual({ foo: 1 }, client.median([ { foo: 1 } ]));
        test.deepEqual({ foo: 1.5 }, client.median([ { foo: 1 },
                                        { foo: 2 } ]));

        test.deepEqual({ foo: 2 }, client.median([ { foo: 1 },
                                        { foo: 2 },
                                        { foo: 2 }]));

        test.deepEqual({ foo: 2 }, client.median([ { foo: 3 },
                                        { foo: 1 },
                                        { foo: 2 }]));

        test.deepEqual({ foo: 2 }, client.median([ { foo: 3 },
                                        { foo: 2 },
                                        { foo: 1 },
                                        { foo: 2 }]));

        test.deepEqual({ foo: 2 }, client.median([ { foo: 3 },
                                        { foo: 3 },
                                        { foo: 2 },
                                        { foo: 1 },
                                        { foo: 1 }]));

        test.done();
    },

    '#benchmark: sync': function (test) {
        test.expect(2);

        var results = client.benchmark();
        console.log(client.full_results);
        console.log(client.results);
        test.equal('object', typeof results);
        test.equal(15, results.requests);

        test.done();
    },

    //'#benchmark: async': function (test) {
        //test.expect(2);

        //client.benchmark( function (result) {
            //test.equal('object', typeof result);
            //test.equal(75, result.o);
        //});

        //test.done();
    //},
};



