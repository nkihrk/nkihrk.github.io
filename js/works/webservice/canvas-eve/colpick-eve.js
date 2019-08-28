(function (window, $) {
    const hogeEve = () => {
        // Flags
        const flgs = {
            'hoge_flg': false,
        };


        ///


        // Initialize values
        const init = () => {
            $(document).on(EVENTNAME_TOUCHSTART, function (e) {});
        };
        init();


        const Update = function () {
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {});
        };
        Update();


        // Configuring flags
        const configFlgs = () => {
            // Activate flags
            const activate = () => {
                $(document).on('mousedown', function (e) {
                    if (e.button == 1) {
                        flgs.hoge_flg = true;
                        console.log('flgs.hoge_flg', flgs.hoge_flg);
                    }
                });
            };
            activate();

            // Reset flags
            $(document).on('mouseup', function (e) {
                if (flgs.hoge_flg == true) {
                    flgs.hoge_flg = false;
                    console.log('flgs.hoge_flg', flgs.hoge_flg);
                }
            });
        };
        configFlgs();


        // Execute if flags are true
        const main = () => {
            $(document).mousemove(function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                if (flgs.hoge_flg == true) {

                }
            });
        };
        main();


    };
    hogeEve();
})(window, jQuery);