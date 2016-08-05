(function () {
    'use strict';

    /*global console, CustomEvent */

    var containers = document.querySelectorAll('.slider');
    var i;

    
    
    var swipeFunc = {
        touches : {
            "touchstart": {"x": -1, "y": -1},
            "touchmove" : {"x": -1, "y": -1},
            "touchmoved"  : false,
            "direction" : "undetermined"
        },
        touchHandler: function (event) {
            var touch;

            if (typeof event !== 'undefined') {
                if (typeof event.touches !== 'undefined') {
                    touch = event.touches[0];
                    switch (event.type) {
                    case 'touchstart':
                        swipeFunc.touchmoved = false;

                        swipeFunc.touches[event.type].x = touch.pageX;
                        swipeFunc.touches[event.type].y = touch.pageY;

                        break;
                    case 'touchmove':
                        swipeFunc.touchmoved = true;

                        swipeFunc.touches[event.type].x = touch.pageX;
                        swipeFunc.touches[event.type].y = touch.pageY;

                        break;
                    case 'touchend':
                        if (swipeFunc.touches.touchstart.x > -1 && swipeFunc.touches.touchmove.x > -1 && swipeFunc.touchmoved) {
                            swipeFunc.touches.direction = swipeFunc.touches.touchstart.x < swipeFunc.touches.touchmove.x ? "right" : "left";

                            // DO STUFF HERE

                            event.target.dispatchEvent(new CustomEvent('swipe', {
                                detail: {
                                    dirrection: swipeFunc.touches.direction
                                },
                                bubbles: true,
                                cancelable: true
                            }));

                        }
                        break;
                    default:
                        break;
                    }
                }
            }
        },
        init: function () {
            for (i = 0; i < containers.length; i = i + 1) {
                var container = containers[i];
                container.addEventListener('touchstart', swipeFunc.touchHandler, false);
                container.addEventListener('touchmove', swipeFunc.touchHandler, false);
                container.addEventListener('touchend', swipeFunc.touchHandler, false);
            }
        }
    };

    swipeFunc.init();

    function left(container) {
        var w = container.clientWidth;
        container.current -= 1;

        if (container.current < 0) {
            container.current = 0;
        } else {
            container.querySelector('.slide_empty').style.marginLeft = -(w * container.current) + 'px';
        }
    }

    function right(container) {
        var w = container.clientWidth;
        container.current += 1;

        if (container.current > container.count) {
            container.current = container.count;
        } else {
            container.querySelector('.slide_empty').style.marginLeft = -(w * container.current) + 'px';
        }
    }

    function handler(e) {
        if (e.target.classList.contains('slider__arrow')) {
            e.stopPropagation();
        }
        if (e.target.classList.contains('slider__arrow_left')) {
            left(e.target.parentElement);
        }
        if (e.target.classList.contains('slider__arrow_right')) {
            right(e.target.parentElement);
        }
    }
    
    function swipe(event, container) {
        if (event.detail.dirrection === 'left') {
            right(container);
        }

        if (event.detail.dirrection === 'right') {
            left(container);
        }
    }

    for (i = 0; i < containers.length; i = i + 1) {
        var container = containers[i];
        container.current = 0;
        container.count = container.querySelectorAll('.slide').length - 2;

        container.addEventListener('swipe', function (event) {
            swipe(event, container);
        });

        container.addEventListener('click', handler);
    }

}());