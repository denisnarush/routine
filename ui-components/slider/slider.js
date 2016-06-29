(function () {
    'use strict';

    var containers = document.querySelectorAll('.b-slider');
    var i;

    function left(container) {
        var w = container.clientWidth;
        container.current -= 1;

        if (container.current < 0) {
            container.current = 0;
        } else {
            container.querySelector('.b-slide__empty').style.marginLeft = -(w * container.current) + 'px';
        }
    }

    function right(container) {
        var w = container.clientWidth;
        container.current += 1;

        if (container.current > container.count) {
            container.current = container.count;
        } else {
            container.querySelector('.b-slide__empty').style.marginLeft = -(w * container.current) + 'px';
        }
    }
    
    function handler(e) {
        if (e.target.classList.contains('l')) {
            left(e.target.parentElement);
        }
        if (e.target.classList.contains('r')) {
            right(e.target.parentElement);
        }
    }
    
    for (i = 0; i < containers.length; i = i + 1) {
        var container = containers[i];
        container.current = 0;
        container.count = container.querySelectorAll('.b-slide').length - 2;

        container.addEventListener('click', handler);
    }

}());