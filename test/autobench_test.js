var Autobench = require('lib/autobench');

module.exports = {
    'new Autobench(): defaults': function (test) {
        test.expect(5);

        var ab = new Autobench();
        test.ok(ab);
        test.equal("localhost" , ab.config.server);
        test.equal(80          , ab.config.port);
        test.equal("/"         , ab.config.uri);
        test.equal(9           , ab.config.runs);

        test.done();
    },

    'new Autobench(object): passed options': function (test) {
        test.expect(5);

        ab = new Autobench({
            server : "example.com",
            port   : 8080,
            uri    : "/foobar?foo=bar&bar=foo",
            runs   : 3
        });

        test.ok(ab.config);
        test.equal("example.com"
                        , ab.config.server);
        test.equal(8080 , ab.config.port);
        test.equal("'/foobar?foo=bar&bar=foo'"
                        , ab.config.uri);
        test.equal(3    , ab.config.runs);

        test.done();
    },

    'new Autobench(file)': function (test) {
        test.expect(6);

        test.throws(function () {
            var ab = new Autobench("test/support/missing.json");
        }, Error);

        var ab = new Autobench("test/support/config.json");
        test.ok(ab.config);
        test.equal("localhost" , ab.config.server);
        test.equal(80          , ab.config.port);
        test.equal("'/foobar?foo=bar&bar=foo'"
                               , ab.config.uri);
        test.equal(9           , ab.config.runs);

        test.done();
    },

    'config scrubbing - main': function (test) {
        test.expect(4);

        var ab = new Autobench();
        // which runs scrubbing

        test.equal("localhost" , ab.config.server);
        test.equal(80          , ab.config.port);
        test.equal("/"         , ab.config.uri);
        test.equal(9           , ab.config.runs);

        test.done();
    },

    'config scrubbing - httperf': function (test) {
        test.expect(4);

        var ab = new Autobench();
        test.equal("localhost" , ab.config.httperf.server);
        test.equal(80          , ab.config.httperf.port);
        test.equal("/"         , ab.config.httperf.uri);
        test.equal(9           , ab.config.httperf['num-conns']);

        test.done();
    },

    'config scrubbing - yslow': function (test) {
        test.expect(1);

        var ab = new Autobench();
        test.equal("--format json 'http://localhost/'",
                    ab.config.yslow.join(" "));

        test.done();
    },

    'config scrubbing - phantomas': function (test) {
        test.expect(1);

        var ab = new Autobench();
        test.equal("--format=json --url='http://localhost/'",
                    ab.config.phantomas.join(" "));

        test.done();
    },

    'benchmarkers': function (test) {
        test.expect(3);

        var ab = new Autobench();
        test.equal('object', typeof ab.render);
        test.equal('object', typeof ab.client);
        test.equal('object', typeof ab.yslow);

        test.done();
    }

};

// vim: ft=javascript:
