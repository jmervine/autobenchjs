var YSlow = require('lib/yslow');

// BEGIN stubs
var sample_results = {
    o: 75
};

var stub_runSync = function () {
    return sample_results;
};

var stub_run = function (callback) {
    callback(sample_results);
};

// END stubs
var yslow;

module.exports = {
    setUp: function (callback) {
        yslow = new YSlow("./test/support/script.js", [ "http://example.com/" ]);
        yslow.yslow.run = stub_run;
        yslow.yslow.runSync = stub_runSync;
        callback();
    },

    tearDown: function (callback) {
        yslow = undefined;
        callback();
    },

    'new YSlow(config)': function (test) {
        test.expect(5);

        test.ok(yslow);
        test.ok(yslow.yslow);
        test.ok(yslow.yslow.script);
        test.ok(yslow.yslow.args);
        test.ok(yslow.yslow.args.indexOf("http://example.com/") !== -1);

        test.done();
    },

    '#benchmark: sync': function (test) {
        test.expect(2);

        test.equal('object', typeof yslow.benchmark());
        test.equal(75, yslow.benchmark().o);

        test.done();
    },

    '#benchmark: async': function (test) {
        test.expect(2);

        yslow.benchmark( function (result) {
            test.equal('object', typeof result);
            test.equal(75, result.o);
        });

        test.done();
    },
};


