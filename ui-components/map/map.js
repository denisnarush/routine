(function () {
    'use strict';

    /*global ymaps*/

    var myMap;

    function init() {
        myMap = new ymaps.Map(document.querySelector('.b-map'), {
            center: [55.76, 37.64],
            zoom: 7
        });
    }

    ymaps.ready(init);
}());