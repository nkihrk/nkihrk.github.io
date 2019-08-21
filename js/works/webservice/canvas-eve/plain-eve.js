(function (window, $) {
    const plainEve = () => {
        // Flags
        const flgs = {
            'mousewheel_avail_flg': false,
        };

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
            $(document).on('mousedown', '', function (e) {
                var $plain = $('#plain');

                plain.size.width = $plain.outerWidth();
                plain.size.height = $plain.outerHeight();

                plain.pos.left = $plain.offset().left;
                plain.pos.top = $plain.offset().top;
                // Image-space mouse coordinates
                plain.relPos.left = e.clientX - plain.pos.left;
                plain.relPos.top = e.clientY - plain.pos.top;
                if (e.button == 1) {
                    flgs.mousewheel_avail_flg = true;
                    console.log('flgs.mousewheel_avail_flg', flgs.mousewheel_avail_flg);
                }
            });
        };
        init();


        // Configuring flags
        const configFlgs = () => {
            // Activate flags
            const activate = () => {
                $(document).on('mousedown', function (e) {
                    // if (e.button == 1) {
                    //     flgs.mousewheel_avail_flg = true;
                    //     console.log('flgs.mousewheel_avail_flg', flgs.mousewheel_avail_flg);
                    // }
                });
            };
            activate();

            // Reset flags
            $(document).on('mouseup', function (e) {
                if (flgs.mousewheel_avail_flg == true) {
                    flgs.mousewheel_avail_flg = false;
                    console.log('flgs.mousewheel_avail_flg', flgs.mousewheel_avail_flg);
                }
            });
        };
        configFlgs();


        // Execute if flags are true
        const main = () => {
            $(document).mousemove(function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                if (flgs.mousewheel_avail_flg == true) {
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