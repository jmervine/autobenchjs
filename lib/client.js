var Phapper = require('phapper');
var _       = require('underscore');

function Client(script, runs, config) {
    this.runs = runs;
    this.phantomas = new Phapper(script, config);
}

Client.prototype = {
    benchmark: function (callback) {
        var resultset = [];
        for (var i = 0; i < this.runs; i++) {
            if (typeof callback === 'function') {
                return this.phantomas.run( function (result) {
                    resultset.push(result);
                    callback();
                });
            }
            resultset.push(this.phantomas.runSync());
        }
        this.full_results = resultset;
        this.results = this.median(resultset);
        return this.results;
    },

    median: function (results, key) {
        if (typeof key === 'undefined') {
            var median_set = {};
            var keys = Object.keys(results[0]);
            for (var i = 0; i < keys.length; i++) {
                median_set[keys[i]] = this.median(results, keys[i]);
            }
            return median_set;
        }

        var sorted = _.sortBy(results, key);
        var median_value;

        var len = sorted.length-1;

        switch (len) {
            case 1:
                median_value = sorted[0][key];
                break;
            case 2:
                median_value = (sorted[0][key]+sorted[1][key])/2;
                break;
            default:
                if (len % 2 === 0) {
                    // getting the mean of the two middle numbers
                    console.log("floor: " + Math.floor(len/2));
                    console.log("ceil:  " + Math.ceil(len/2));
                    median_value = (sorted[Math.floor(len/2)][key]
                                    + sorted[Math.ceil(len/2)][key]
                                   ) / 2;
                } else {
                    median_value = sorted[Math.round((len-1)/2)][key];
                }
        }
        return median_value;
    }
};

module.exports = Client;

