(function () {
    'use strict';

    var anchors = document.querySelectorAll('.b-anchor');
    var i;


    function scrollTo(to, t) {
        var ms = t || 250;

        if (arguments.length < 1) {
            return false;
        }

        var path = to - document.body.scrollTop;
        var startTime = (new Date()).getTime();

        function animate() {
            var t = (new Date()).getTime();
            var d =  t - startTime;

            if (d > ms) {
                document.body.scrollTop = to;
                return false;
            }
            
            var tick = d * 100 / ms;
            document.body.scrollTop = path * (tick / 100);

            window.requestAnimationFrame(animate);
        }

        animate();
    }

    function handler(e) {
        e.preventDefault();

        var selector = e.target.getAttribute('href');
        var destinationElement = document.querySelector(selector);
        
        if (!destinationElement) {
            return false;
        }

        var to = destinationElement.offsetTop;

        scrollTo(to);
    }

    for (i = 0; i < anchors.length; i = i + 1) {
        var anchor = anchors[i];

        anchor.addEventListener('click', handler);
    }

}());