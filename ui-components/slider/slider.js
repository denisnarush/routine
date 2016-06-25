(function () {
    var containers = document.querySelectorAll('.b-slider');


    for (var i = 0; i < containers.length; i++) {
        var container = containers[i];
        container.current = 0;
        container.count = container.childElementCount - 4;

        container.addEventListener('click', function (e) {
            if (e.target.classList.contains('l')) {
                Left(e.target.parentElement);
            }
            if (e.target.classList.contains('r')) {
                Right(e.target.parentElement);
            }
        });
    }

    function Left(container) {
        var w = container.clientWidth;
        container.current -= 1;

        if (container.current < 0) {
            container.current = 0;
        } else {
            container.querySelector('.b-slide__empty').style.marginLeft = -(w * container.current) + 'px';
        }
    }

    function Right(container) {
        var w = container.clientWidth;
        container.current += 1;

        if (container.current > container.count) {
            container.current = container.count;
        } else {
            container.querySelector('.b-slide__empty').style.marginLeft = -(w * container.current) + 'px';
        }
    }
}());