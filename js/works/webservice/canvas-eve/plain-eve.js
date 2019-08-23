(function (window, $) {
    const plainEve = () => {
        // Flags

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
                // Image-space mouse coordinates
                plain.relPos.left = e.clientX - plain.pos.left;
                plain.relPos.top = e.clientY - plain.pos.top;
                if (e.button == 1 && !supportTouch) {
                    glFlgs.mousewheel_avail_flg = true;
                    console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                }
                if (supportTouch == 1) {
                    glFlgs.mousewheel_avail_flg = true;
                    console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                }
            });
        };
        init();


        // Configuring flags
        const configFlgs = () => {
            // Activate flags
            const activate = () => {
                $(document).on(EVENTNAME_TOUCHSTART, function (e) {
                    // if (e.button == 1) {
                    //     glFlgs.mousewheel_avail_flg = true;
                    //     console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                    // }
                });
            };
            activate();

            // Reset flags
            $(document).on(EVENTNAME_TOUCHEND, function (e) {
                if (glFlgs.mousewheel_avail_flg == true) {
                    glFlgs.mousewheel_avail_flg = false;
                    console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                }
            });
        };
        configFlgs();


        // Execute if flags are true
        const main = () => {
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                if (glFlgs.mousewheel_avail_flg == true) {
                    let resPosLeft = e.clientX - plain.relPos.left;
                    let resPosTop = e.clientY - plain.relPos.top;
                    $('#plain').css({
                        'left': resPosLeft + 'px',
                        'top': resPosTop + 'px'
                    });
                }
            });
        };
        main();


    };
    plainEve();
})(window, jQuery);