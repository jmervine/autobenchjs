var HTTPerf = require('httperfjs');

function Render(config) {
    if (typeof config === 'undefined') {
        config = {};
    }
    this.httperf = new HTTPerf(config);
    this.httperf.parse = true;
}

Render.prototype.benchmark = function (callback) {
    if (typeof callback === 'function') {
        return this.httperf.run(callback);
    }
    this.results = this.httperf.runSync();
    return this.results;
};

module.exports = Render;
