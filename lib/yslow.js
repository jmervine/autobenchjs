var Phapper = require('phapper');

function YSlow(script, config) {
    this.yslow = new Phapper(script, config);
}

YSlow.prototype.benchmark = function (callback) {
    if (typeof callback === 'function') {
        return this.yslow.run(callback);
    }
    this.results = this.yslow.runSync();
    return this.results;
};

module.exports = YSlow;
