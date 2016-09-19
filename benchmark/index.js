'use strict';
var suites = [
  require('./suite/testing')
];
suites.forEach(function (suite) {
    suite.suite.on('cycle', function (event) {
        console.log(String(event.target));
    }).on('complete', function () {
        console.log('Result: fastest is ' + this.filter('fastest').map('name'));
    }).run({
        'async': false
    });
});