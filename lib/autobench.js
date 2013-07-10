var fs      = require('fs');
var Phapper = require('phapper');
var Render  = require('lib/render');
var Client  = require('lib/client');
var YSlow   = require('lib/yslow');

function Autobench(config) {
    switch (typeof config) {
        case 'string':
            if (!fs.existsSync(config)) {
                throw new Error("File not found! " + config);
            }
            this.config = require(config);
            break;
        case 'object':
            this.config = config;
            break;
        default:
            this.config = {};
    }

    this.config = _scrub(this.config);

    this.render = new Render(this.config.httperf);
    this.client = new Client(this.config.paths.phantomas, this.config.phantomas);
    this.yslow  = new YSlow(this.config.paths.yslow, this.config.yslow);
}

function _scrub(config) {
    if (typeof config === 'undefined') {
        config = {};
    }

    // defaults

    if (!config.hasOwnProperty('server')) {
        config.server = "localhost";
    }
    if (!config.hasOwnProperty('port')) {
        config.port = 80;
    }
    if (!config.hasOwnProperty('uri')) {
        config.uri = "/";
    } else {
        config.uri = "'"+config.uri+"'";
    }
    if (!config.hasOwnProperty('runs')) {
        config.runs = 9;
    }

    // httperf
    if (!config.hasOwnProperty('httperf')) {
        config.httperf = {};
    }

    config.httperf.server = config.server;
    config.httperf.port   = config.port;
    config.httperf.uri    = config.uri;
    config.httperf['num-conns'] = config.runs;

    // yslow
    if (!config.hasOwnProperty('yslow')) {
        config.yslow = [];
    }

    config.yslow.push("--format");
    config.yslow.push("json");
    config.yslow.push("'http://"
                        + config.server
                        + port_string(config.port)
                        + config.uri.replace("'", "")
                        + "'");

    // phantomas
    if (!config.hasOwnProperty('phantomas')) {
        config.phantomas = [];
    }

    config.phantomas.push("--format=json");
    config.phantomas.push("--url='http://"
                            + config.server
                            + port_string(config.port)
                            + config.uri.replace("'", "")
                            + "'");

    // paths
    if (!config.hasOwnProperty('paths')) {
        config.paths = {};
    }

    if (!config.paths.hasOwnProperty('yslow')) {
        config.paths.yslow = 'yslow.js';
    }

    if (!config.paths.hasOwnProperty('phantomas')) {
        config.paths.phantomas = 'phantomas/phantomas.js';
    }
    return config;
}

function port_string(port) {
    if (port === 80) {
        return "";
    }
    return ":"+port;
}

module.exports = Autobench;
