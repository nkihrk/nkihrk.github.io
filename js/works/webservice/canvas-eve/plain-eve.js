(function (window, $) {
    const plainEve = () => {
        // Flags
        const flgs = {
            'mousewheel_avail_flg': false,
        };


        ///


        // Initialize values
        const init = () => {};
        init();


        // Configuring flags
        const configFlgs = () => {
            // Activate flags
            const activate = () => {
                $(document).on('mousedown', function (e) {
                    if (e.button == 1) {
                        flgs.mousewheel_avail_flg = true;
                        console.log('flgs.mousewheel_avail_flg', flgs.mousewheel_avail_flg);
                    }
                })
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
        const main = () => {};
        main();


    };
    plainEve();
})(window, jQuery);