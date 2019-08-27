(function (window, $) {
    const plainEve = () => {

        const plain = {
            'size': {
                'width': 0,
                'height': 0
            },
            'pos': {
                'left': 0,
                'top': 0
            },
            'relPos': {
                'left': 0,
                'top': 0
            }
        }


        ///


        // Initialize values
        const init = () => {
            $(document).on(EVENTNAME_TOUCHSTART, function (e) {
                var $plain = $('#plain');

                plain.size.width = $plain.outerWidth();
                plain.size.height = $plain.outerHeight();

                plain.pos.left = $plain.offset().left;
                plain.pos.top = $plain.offset().top;

                plain.relPos.left = clientX - plain.pos.left;
                plain.relPos.top = clientY - plain.pos.top;
                // Image-space mouse coordinates
                if (e.button == 1) {
                    glFlgs.mousewheel_avail_flg = true;
                    console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                }
            });
        };
        init();


        // Update variables everytime a mousemove event is called on wherever
        const Update = function () {
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                // debugCircle('plainPos', 'orange', $('#plain').offset().left, $('#plain').offset().top);
                // debugCircle('zoomPos', 'white', $('#zoom').offset().left, $('#zoom').offset().top);
                // debugCircle('filePos', 'red', $('.file-wrap').offset().left, $('.file-wrap').offset().top);
            });
        };
        Update();


        // Configuring flags
        const configFlgs = () => {
            // Activate flags
            const activate = () => {
                $(document).on(EVENTNAME_TOUCHSTART, function (e) {});
            };
            activate();

            // Reset flags
            $(document).on('mouseup', function (e) {
                if (glFlgs.mousewheel_avail_flg == true) {
                    glFlgs.mousewheel_avail_flg = false;
                    console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                }
            });
        };
        configFlgs();


        // Execute if flags are true
        const main = () => {
            // Move the canvas
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                if (glFlgs.mousewheel_avail_flg == true) {
                    $('#plain').css({
                        'left': clientX - plain.relPos.left + 'px',
                        'top': clientY - plain.relPos.top + 'px'
                    });
                }
            });
        };
        main();


    };
    plainEve();
})(window, jQuery);