var Render = require('lib/render');

// BEGIN stubs
var sample_results = {
    connection_time_median: 500
};

var stub_runSync = function () {
    return sample_results;
};

var stub_run = function (callback) {
    callback(sample_results, "httperf string output");
};
// END stubs
var render;

module.exports = {
    setUp: function (callback) {
        render = new Render({ server: "example.com"});
        render.httperf.run = stub_run;
        render.httperf.runSync = stub_runSync;
        callback();
    },

    tearDown: function (callback) {
        render = undefined;
        callback();
    },

    'new Render(config)': function (test) {
        test.expect(3);

        test.ok(render);
        test.ok(render.httperf);
        test.equal("example.com",render.httperf.params.server);

        test.done();
    },

    '#benchmark: sync': function (test) {
        test.expect(2);

        test.equal('object', typeof render.benchmark());
        test.equal(500, render.benchmark().connection_time_median);

        test.done();
    },

    '#benchmark: async': function (test) {
        test.expect(2);

        render.benchmark( function (result) {
            test.equal('object', typeof result);
            test.equal(500, result.connection_time_median);
        });

        test.done();
    },
};

