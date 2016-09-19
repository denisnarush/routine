var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
suite.add('indexOf', function () {
    'Hello'.indexOf('o');
}).add('match', function () {
    'Hello'.match(/o/);
});
module.exports = {
    suite: suite
};